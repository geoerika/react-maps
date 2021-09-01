import { reportWI } from './datasets'


// TODO more built in types, e.g. intervals, filter
// TODO cap max & mins
export const intensityByMetric = ({
  intensityCallback = false,
  invert = false,
  multiplier,
  base,
  metric,
  metricStats: { max, min },
  getDataObject = d => d,
}) => {
  if (intensityCallback) return d => intensityCallback(d) * multiplier + base
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => intensity(getDataObject(d)[metric]) * multiplier + base
}

export const colorIntensityByMetric = ({
  intensityCallback = false,
  invert = false,
  color, // [{ base, multiplier }]
  metric,
  metricStats: { max, min },
  getDataObject = d => d,
}) => {
  if (intensityCallback) return d => color.map(({ base, multiplier }) => intensityCallback(d) * multiplier + base)
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => color.map(({ base, multiplier }) => intensity(getDataObject(d)[metric]) * multiplier + base)
}

export const calculateReportWIMetrics = (agg, row) => ({
  ...reportWI.DATA_FIELDS.reduce((rowAgg, key) => ({
    ...rowAgg,
    [key]: {
      max: Math.max((agg[key] || { max: null }).max, row[key]),
      min: Math.min((agg[key] || { min: null }).min, row[key]),
    },
  }), {}),
})

/**
 * getCursor - sets cursor for different layers and hover state
 * @param { object } params
 * @param { array } param.layers - current array of layers used in map
 * @return { function } - cursor function
 */
export const getCursor = ({ layers } = {}) => {
  if (layers?.length) {
    const drawLayer = layers.find(layer => layer.id === 'edit-draw layer')
    if (drawLayer?.props?.visible) {
      return drawLayer.getCursor.bind(drawLayer)
    }
  }
  return ({ isDragging, isHovering }) => (isDragging ? 'grabbing' : (isHovering ? 'pointer' : 'grab'))
}

/**
 * truncate - returns formatted string, by truncating to a certain nr of characters
 * @param { string } fullStr - string to format
 * @param { number } strLen - length of formatted string
 * @param { string } separator - string to separate formatted string
 * @returns { string } - formatted string
 */
export function truncate(fullStr, strLen, separator = ' ... ') {
  if (fullStr.length <= strLen) {
    return fullStr
  }
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return fullStr.substr(0, frontChars)
           + separator
           + fullStr.substr(fullStr.length - backChars)
}

// object of formatting functions for lon and lat keys in the POI map
export const formatDataPOI = {
  lon: val => Math.round(val * 100) / 100 + String.fromCharCode(176),
  lat: val => Math.round(val * 100) / 100 + String.fromCharCode(176),
}
