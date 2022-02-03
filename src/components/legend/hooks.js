import { LEGEND_SYMBOL_WIDTH } from '../../constants'


/**
 * useLegendItemElements - React Hook which returns legendElemWidth, title, minValue, maxValue for a legend
 * @param { object } param
 * @param { object } param.legendItemProps - object of legend item properties
 * @returns { object } - { legendElemWidth, title, minValue, maxValue } object of values for legend
 */
export const useLegendItemElements = ({ legendItemProps }) => {
  const {
    min,
    max,
    label,
    metricAliases,
    formatLegendTitle = d => d,
    formatPropertyLabel = d => d,
    formatData,
    legendSize,
  } = legendItemProps

  const legendElemWidth = min !== max && max > 0 ?
    LEGEND_SYMBOL_WIDTH[legendSize] :
    LEGEND_SYMBOL_WIDTH.zero
  const title = formatLegendTitle(metricAliases?.[label] || formatPropertyLabel(label))
  const [minValue, maxValue] = formatData?.[label] ?
    [formatData[label](min), formatData[label](max)] :
    [min, max]

  return { legendElemWidth, title, minValue, maxValue }
}
