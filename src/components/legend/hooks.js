import { LEGEND_TYPE, LEGEND_SYMBOL_WIDTH } from '../../constants'


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

/**
 * useLegendItemDimensions - React Hook which calculates textContainerWidth, symbolContainerLeftMargin,
 *                           textContainerLeftMargin of a Legend Item
 * @param { object } param
 * @param { object } param.legendItemProps - object of legend item properties
 * @param { number } param.legendElemWidth - the symbol with of a legend item (rem)
 * @param { number } param.textMinWidth - the width of the lower value range in the legend (rem)
 * @param { number } param.textMaxWidth - the width of the higher value range in the legend (rem)
 * @returns { object } - { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin } -
 *                        object of sizing values to style different containers in a legen item (rem)
 */
export const useLegendItemDimensions = ({
  legendItemProps,
  legendElemWidth,
  textMinWidth,
  textMaxWidth,
}) => {
  const { min, max, type, dots, size } = legendItemProps

  /*
   * text container width for gradient and elevation legends, where value label centres align with
   * the edges of the legend symbol container
   */
  let textContainerWidth = min !== max && max > 0 && textMinWidth && textMaxWidth ?
    textMinWidth / 2 + textMaxWidth / 2 + legendElemWidth :
    textMinWidth || 0

  let symbolContainerLeftMargin = 0
  let textContainerLeftMargin = 0

  // don't adjust margins when we have no data variance
  if (min !== max && max > 0 && textMinWidth && type !== LEGEND_TYPE.size) {
    symbolContainerLeftMargin = textMinWidth / 2
  }

  if (min !== max && max > 0 && textMinWidth && type === LEGEND_TYPE.size) {
    // for radius (size) width is samller, as the value labels align with the centers of the edge circles
    textContainerWidth = !isNaN(size) && size && !isNaN(dots) && dots ?
      textContainerWidth - (2.5 + dots) * size / 2 : // half of each circle size
      textContainerWidth
    const smallSymbolRadius = !isNaN(size) && size ? 1.75 * size / 2 : 0
    if (smallSymbolRadius <= textMinWidth / 2) {
      symbolContainerLeftMargin = textMinWidth / 2 - smallSymbolRadius
    } else {
      textContainerLeftMargin = smallSymbolRadius - textMinWidth / 2
    }
  }

  return { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin }
}
