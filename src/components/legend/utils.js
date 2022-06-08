import { LEGEND_TYPE, LEGEND_SYMBOL_WIDTH, FONT_SIZE } from '../../constants'


/**
 * getLegendItemElements - returns legendElemWidth, title, minValue, maxValue for a legend
 * @param { object } param
 * @param { object } param.legendItemProps - object of legend item properties
 * @returns { object } - { legendElemWidth, title, minValue, maxValue } object of values for legend
 */
export const getLegendItemElements = ({ legendItemProps }) => {
  const {
    min,
    max,
    label,
    keyAliases,
    formatLegendTitle = d => d,
    formatDataKey = d => d,
    formatDataValue,
    legendSize,
  } = legendItemProps

  const legendElemWidth = max !== min ?
    LEGEND_SYMBOL_WIDTH[legendSize] :
    LEGEND_SYMBOL_WIDTH.zero
  const title = formatLegendTitle(keyAliases?.[label] || formatDataKey(label))

  const [minValue, maxValue] = formatDataValue?.[label] ?
    [formatDataValue[label](min), formatDataValue[label](max)] :
    [min, max]

  return { legendElemWidth, title, minValue, maxValue }
}

/**
 * getValueRangeWidth - returns the widths for the range values (rem)
 * @param { object } param
 * @param { object } param.textMin - ref to lower value in a legend item
 * @param { object } param.textMax - ref to higher value in a legend item
 * @returns { array } - array of legend item range value widths (rem)
 */
export const getValueRangeWidth = ({ textMin, textMax }) =>
  [
    textMin.current?.getBoundingClientRect()?.width ?
      textMin.current.getBoundingClientRect().width / FONT_SIZE :
      0,
    textMax.current?.getBoundingClientRect()?.width ?
      textMax.current.getBoundingClientRect().width / FONT_SIZE :
      0,
  ]

/**
 * getLegendItemDimensions - calculates textContainerWidth, symbolContainerLeftMargin,
 *                           textContainerLeftMargin of a Legend Item
 * @param { object } param
 * @param { object } param.legendItemProps - object of legend item properties
 * @param { number } param.legendElemWidth - the symbol with of a legend item (rem)
 * @param { number } param.textMinWidth - the width of the lower value range in the legend (rem)
 * @param { number } param.textMaxWidth - the width of the higher value range in the legend (rem)
 * @returns { object } - { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin } -
 *                        object of sizing values to style different containers in a legen item (rem)
 */
export const getLegendItemDimensions = ({
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
  let textContainerWidth = min !== max && textMinWidth && textMaxWidth ?
    textMinWidth / 2 + textMaxWidth / 2 + legendElemWidth :
    textMinWidth || 0

  let symbolContainerLeftMargin = 0
  let textContainerLeftMargin = 0

  // don't adjust margins when we have no data variance
  if (min !== max && textMinWidth && type !== LEGEND_TYPE.size) {
    symbolContainerLeftMargin = textMinWidth / 2
  }

  if (min !== max && textMinWidth && type === LEGEND_TYPE.size) {
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
