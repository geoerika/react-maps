import {
  LEGEND_TYPE,
  LEGEND_SYMBOL_WIDTH,
  LEGEND_SIZE,
  LEGEND_DOTS,
  FONT_SIZE,
  LEGEND_TEXT_GAP,
} from '../../constants'


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
 * getElemWidth - returns the width of an element in rem units
 * @param { element } - elem - an element
 * @returns { number } - the element width in rem units
 */
export const getElemWidth = (elem) => elem?.current?.getBoundingClientRect()?.width ?
  elem?.current.getBoundingClientRect().width / FONT_SIZE :
  0

/**
 * getValueRangeWidth - returns the widths for the range values (rem)
 * @param { object } param
 * @param { object } param.textMin - ref to lower value in a legend item
 * @param { object } param.textMax - ref to higher value in a legend item
 * @param { object } param.lineTextMin - ref to lower value of line text legend item
 * @param { object } param.lineTextMax - ref to higher value of line text legend item
 * @returns { array } - array of legend item range value widths (rem)
 */
export const getValueRangeWidth = ({ textMin, textMax, lineTextMin, lineTextMax }) =>
  [
    getElemWidth(textMin),
    getElemWidth(textMax),
    Math.max(getElemWidth(lineTextMin), getElemWidth(lineTextMax)),
  ]

/**
 * getLegendItemDimensions - calculates textContainerWidth, symbolContainerLeftMargin,
 *                           textContainerLeftMargin of a Legend Item
 * @param { object } param
 * @param { object } param.legendItemProps - object of legend item properties
 * @param { number } param.legendElemWidth - the symbol with of a legend item (rem)
 * @param { number } param.textMinWidth - the width of the lower value range in the legend (rem)
 * @param { number } param.textMaxWidth - the width of the higher value range in the legend (rem)
 * @param { string } param.legendSize - the size of the legend (sm or lg)
 * @returns { object } - { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin } -
 *                        object of sizing values to style different containers in a legend item (rem)
 */
export const getLegendItemDimensions = ({
  legendItemProps,
  legendElemWidth,
  textMinWidth,
  textMaxWidth,
  legendSize,
}) => {
  const { min, max, type, dots, size } = legendItemProps

  /*
   * text container width for gradient and elevation legends, where value label centres align with
   * the edges of the legend symbol container
   */
  const minTextContainerWidth =  textMinWidth + textMaxWidth + LEGEND_TEXT_GAP
  let textContainerWidth = min !== max && textMinWidth && textMaxWidth ?
    Math.max(
      (textMinWidth + textMaxWidth) / 2 + legendElemWidth,
      minTextContainerWidth,
    ) :
    textMinWidth || 0

  let symbolContainerLeftMargin = 0
  let textContainerLeftMargin = 0

  if (min !== max && textMinWidth && ![LEGEND_TYPE.size, LEGEND_TYPE.lineWidth].includes(type)) {
    if (legendElemWidth >= (textMinWidth + textMaxWidth) / 2 + LEGEND_TEXT_GAP ||
      textMinWidth + LEGEND_TEXT_GAP <= legendElemWidth) {
      symbolContainerLeftMargin = textMinWidth / 2
    } else if (textMinWidth > textMaxWidth && textMaxWidth + LEGEND_TEXT_GAP <= legendElemWidth) {
      symbolContainerLeftMargin = Math.max(
        textMinWidth - legendElemWidth  + textMaxWidth / 2 + LEGEND_TEXT_GAP,
        textMinWidth / 2 + LEGEND_TEXT_GAP,
      )
    } else {
      symbolContainerLeftMargin = textMinWidth - (legendElemWidth - LEGEND_TEXT_GAP) / 2
    }
  }

  if (min !== max && textMinWidth && type === LEGEND_TYPE.size) {
    /*
     * for radius (size) text width is more complex to calculate, as the value labels align with the
     * centers of the edge circles
     */

    const smallSymbolRadius = !isNaN(size) && size ? 1.75 * size / 2 : 0

    let largeCircleIndex = 0

    if (dots) {
      largeCircleIndex = dots - 1
    } else if (legendSize === LEGEND_SIZE.large) {
      largeCircleIndex = LEGEND_DOTS.large - 1
    } else {
      largeCircleIndex = LEGEND_DOTS.small - 1
    }

    const largeSymbolRadius = !isNaN(size) && size ? (largeCircleIndex + 1.75) * size / 2 : 0

    textContainerWidth = Math.max(
      legendElemWidth - smallSymbolRadius - largeSymbolRadius + (textMinWidth + textMaxWidth) / 2 ,
      minTextContainerWidth,
    )

    if (smallSymbolRadius <= textMinWidth / 2) {
      if (legendElemWidth - smallSymbolRadius - largeSymbolRadius >= (textMinWidth + textMaxWidth) / 2 + LEGEND_TEXT_GAP ||
        textMinWidth + LEGEND_TEXT_GAP - 2 * smallSymbolRadius <= legendElemWidth) {
        symbolContainerLeftMargin = textMinWidth / 2 - smallSymbolRadius
      } else if (textMinWidth > textMaxWidth && (textMaxWidth + LEGEND_TEXT_GAP) / 2 <= legendElemWidth / 2 - largeSymbolRadius) {
        symbolContainerLeftMargin = Math.max(
          textMinWidth - legendElemWidth  + textMaxWidth / 2 + LEGEND_TEXT_GAP + largeSymbolRadius,
          textMinWidth / 2 + LEGEND_TEXT_GAP - smallSymbolRadius,
        )
      } else {
        symbolContainerLeftMargin = textMinWidth - (legendElemWidth - LEGEND_TEXT_GAP) / 2
      }
    } else {
      textContainerLeftMargin = smallSymbolRadius - textMinWidth / 2
    }
  }

  return { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin }
}
