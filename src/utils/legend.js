import  { getDataRange } from './index'
import { LEGEND_TYPE, LEGEND_SIZE, LEGEND_DOTS, LEGEND_RADIUS_SIZE } from '../constants'


/**
 * setLegendOpacity - adjusts legend opacity to match closer to deck.gl layer opacity
 * @param { object } param
 * @param { number } param.opacity - map opacity value
 * @returns { number  } - legend opacity value
 */
export const setLegendOpacity = ({ opacity }) =>
  opacity >= 1 ? 1 : (opacity > 0.6 ? 0.9 : opacity + 0.2)

/**
* setLegendConfigs - set config objects for all legends of a map layer
* @param { object } param
* @param { string } param.elevationBasedOn - data attribute key for elevation
* @param { string } param.fillBasedOn - data attribute key for fill
* @param { array } param.fillColors - array of string or array colors
* @param { string } param.objColor - string format colour 'rgb(r, g, b, opacity)'
* @param { string } param.radiusBasedOn - data attribute key for radius
* @param { array } param.data - data array
* @param { function } param.dataPropertyAccessor - function to access data attribute values in the data objects
* @param { object } param.legendProps - various other legend props:
*               {keyAliases, formatLegendTitle, formatDataKey, formatDataValue, symbolLineColor}
* @returns { array  } - array of legend config objects
*/
export const setLegendConfigs = ({
  elevationBasedOn = '',
  fillBasedOn = '',
  radiusBasedOn = '',
  arcWidthBasedOn = '',
  fillColors,
  objColor = '',
  data = [],
  dataPropertyAccessor = d => d,
  legendSize = LEGEND_SIZE.large,
  layerTitle,
  ...legendProps
}) => {

  let [minColor, maxColor] = [objColor, objColor]
  if (fillBasedOn) {
    if (Array.isArray(fillColors)) {
      [minColor, maxColor] = [fillColors?.[0], fillColors?.[1]]
    }
    if (typeof fillColors === 'string') {
      [minColor, maxColor] = [fillColors, fillColors]
    }
  }

  const legends = []
  if (fillBasedOn.length && data?.length) {
    // TODO support quantile/quantize
    // i.e. different lengths of fillColors[]
    const dataRange = getDataRange({ data, dataKey: fillBasedOn, dataPropertyAccessor })
    legends.push({
      layerTitle,
      minColor,
      maxColor,
      type: LEGEND_TYPE.gradient,
      min: dataRange[0],
      max: dataRange[1],
      label: fillBasedOn,
      ...legendProps,
    })
  }

  if (elevationBasedOn.length && data?.length) {
    const dataRange = getDataRange({ data, dataKey: elevationBasedOn, dataPropertyAccessor })
    legends.push({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      type: LEGEND_TYPE.elevation,
      minColor,
      maxColor,
      min: dataRange[0],
      max: dataRange[1],
      label: elevationBasedOn,
      ...legendProps,
    })
  }

  if (radiusBasedOn.length && data?.length) {
    const dataRange = getDataRange({ data, dataKey: radiusBasedOn, dataPropertyAccessor })
    legends.push({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      minColor,
      maxColor,
      type: LEGEND_TYPE.size,
      // TO DO - use to customize legend symbol for radius/size
      dots: LEGEND_DOTS[legendSize],
      size: LEGEND_RADIUS_SIZE.default,
      zeroRadiusSize: LEGEND_RADIUS_SIZE.zero,
      min: dataRange[0],
      max: dataRange[1],
      label: radiusBasedOn,
      ...legendProps,
    })
  }

  if (arcWidthBasedOn.length && data?.length) {
    const dataRange = getDataRange({ data, dataKey: arcWidthBasedOn, dataPropertyAccessor, noZeroMin: true })
    legends.push({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      type: LEGEND_TYPE.lineWidth,
      minColor,
      maxColor,
      min: dataRange[0],
      max: dataRange[1],
      label: arcWidthBasedOn,
      ...legendProps,
    })
  }

  if (layerTitle && layerTitle !== 'Arc Layer' && !(fillBasedOn.length || radiusBasedOn.length)) {
    legends.push({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      type: LEGEND_TYPE.icon,
      maxColor,
    })
  }

  return legends
}
