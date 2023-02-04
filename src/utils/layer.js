import { getDataRange } from './index'
import { SCALES } from '../constants'


/**
 * setFinalLayerDataProperty - returns function or values to set deck.gl layer property (ex: fill colour, radius)
 * @param { object } param
 * @param { array } param.data - data array
 * @param { number || string || array || object } param.value - value for (attribute data || layer prop) or data attribute key
 * @param { number || string || array } param.defaultValue - default value attribute data || layer prop
 * @param { function } param.dataScale - D3 scale function
 * @param { array } param.valueOptions - array of range values for the deck.gl layer property
 * @param { function } param.dataPropertyAccessor - function to help access attribute data
 * @param { function } param.geometryAccessor - function to help access geometry keys
 * @param { string } param.mvtGeoKey - geometry key for mvt layer
 * @param { string } param.highlightId - id of selected object on the map
 * @param { object } param.keyAliases - object of pairs { key: alias } for data keys
 * @param { function } param.formatDataKey - function to format data key
 * @param { object } param.formatDataValue - object of { key: function } pairs to format values for individual data keys
 * @return { function || number || array  } - final function/number/array for deck.gl layer data accessor
 */
export const setFinalLayerDataProperty = ({
  data,
  value,
  defaultValue,
  dataScale = 'linear',
  valueOptions,
  dataPropertyAccessor = d => d,
  geometryAccessor = d => d,
  mvtGeoKey,
  highlightId = null,
  keyAliases,
  formatDataKey = d => d,
  formatDataValue = {},
  noZeroMin,
}) => {
  if (!value && isNaN(value)) {
    return typeof defaultValue === 'function' ? defaultValue(highlightId) : defaultValue
  }
  // case for text layer
  if (value.title) {
    return d => getLabel(d)({ value, dataPropertyAccessor, keyAliases, formatDataKey, formatDataValue })
  }
  // case for radius for GeoJSON layer - there are no valueOptions for this layer
  if (value.field && !valueOptions && !data?.tileData?.length) {
    return d => dataPropertyAccessor(d)?.[value.field]
  }
  let layerData = data?.tileData?.length ? data.tileData : data

  const setTileProp = ({ propValue, dataRange }) => {
    layerData = Object.fromEntries(data.tileData.map((item) =>
      [geometryAccessor(item)[mvtGeoKey], { value: dataPropertyAccessor(item)?.[value.field] }]))
    return ({ properties: { geo_id } }) => {
      const { value } = layerData[geo_id] || {}
      if (value || value === dataRange[0]) {
        return typeof propValue === 'function' ? propValue(value) : propValue
      }
      // tiles with no data values will be transparent
      return [255, 255, 255, 0]
    }
  }

  if (layerData?.length && value.field?.length) {
    const dataRange = getDataRange({ data: layerData, dataKey: value.field, dataPropertyAccessor, noZeroMin })
    if (valueOptions?.length) {
      const sample = dataPropertyAccessor(layerData[0])
      if (sample?.[value.field] === undefined) {
        return defaultValue
      }

      if (dataRange[0] !== dataRange[1]) {
        const d3Fn = SCALES[dataScale](dataRange, valueOptions)
        // case for MVT layer
        if (data?.tileData?.length) {
          return setTileProp({ propValue: d3Fn, dataRange })
        }
        return (d) => d3Fn(dataPropertyAccessor(d)?.[value.field])
      }
      return noZeroMin && dataRange[0] ? valueOptions[1] : valueOptions[0]
    }

    // allow layer props with no data values and valueOptions, such as getLineWidth in MVT layers, to be set transparent
    if (data?.tileData?.length) {
      return setTileProp({ propValue: value.customValue || defaultValue, dataRange })
    }
  }

  return typeof value === 'function' ? value(highlightId) : value
}

/**
 * getLabel - creates Text Layer label for each data point
 * @param { object } d - data element object
 * @param { object } param
 * @param { object } param.value - { title, valueKeys } object
 * @param { function } param.dataPropertyAccessor - function to access data properties
 * @param { object } param.keyAliases - object of pairs { key: alias } for data keys
 * @param { object } param.formatDataKey - function to format data key
 * @param { object } param.formatDataValue - object of { key: function } pairs
 * @returns { string } - string value of Label/Text for Text Layer
 */
const getLabel = d => ({ value, dataPropertyAccessor, keyAliases, formatDataKey, formatDataValue }) => {
  let labelValues = ''
  const labelKeyValue = d => ({ valueKey }) => dataPropertyAccessor(d)?.[valueKey]

  const getFormatLabelValue = d => ({ valueKey, labelKeyValue, formatDataValue }) => formatDataValue[valueKey] ?
    formatDataValue[valueKey](labelKeyValue(d)({ valueKey })) :
    labelKeyValue(d)({ valueKey })

  const getLabelValue = ({ valueKey }) =>
    `\n${keyAliases?.[valueKey] || formatDataKey(valueKey)}: ${getFormatLabelValue(d)({ valueKey, labelKeyValue, formatDataValue })}`

  labelValues = value?.valueKeys?.reduce((acc, valueKey) => acc + getLabelValue({ valueKey }), '')

  return `${keyAliases?.[value.title] || formatDataKey(value.title)}: ${dataPropertyAccessor(d)?.[value.title]}${labelValues.length ? labelValues : ''}`
}
