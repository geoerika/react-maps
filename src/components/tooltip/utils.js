import { CURSOR_BUFFER, CURSOR_BUFFER_X, TOOLTIP_BUFFER } from './../../constants'


/**
* getPosition - sets position of tooltip on the map, depending on how close to the map edge the tooltip is
* @param { object } param
* @param { number } param.infoinfoXY - cursor coordinate (x or y) value, in pixels
* @param { number } param.tooltipWidthHeightHeight - tooltip width or height, in pixels
* @param { number } param.viewportWidthHeight - viewport width or height, in pixels
* @param { number } param.offset - offset to apply, in pixels
* @returns { number } - tooltip position, left or top, in pixels
*/
export const getPosition = ({
  infoXY,
  tooltipWidthHeight,
  viewportWidthHeight,
  offset,
}) => {
  if (viewportWidthHeight - infoXY > tooltipWidthHeight + CURSOR_BUFFER + 2 * TOOLTIP_BUFFER) {
    return `${infoXY + offset}px`
  }
  if (infoXY > tooltipWidthHeight + TOOLTIP_BUFFER + CURSOR_BUFFER_X) {
    return `${infoXY - tooltipWidthHeight - offset}px`
  }
  if (infoXY >= tooltipWidthHeight / 2 && viewportWidthHeight - infoXY >= tooltipWidthHeight / 2) {
    return `${infoXY - offset}px`
  }
  return `${offset}px`
}

/**
* getOffset - sets offset to apply to left or top for tooltip position
* @param { object } param
* @param { number } param.infoinfoXY - cursor coordinate (x or y) value, in pixels
* @param { number } param.tooltipWidthHeightHeight - tooltip width or height, in pixels
* @param { number } param.viewportWidthHeight - viewport width or height, in pixels
* @param { number } param.offset1 - offset to apply, in pixels
* @param { number } param.offset2 - offset to apply, in pixels
* @returns { number } - tooltip position offset, in pixels
*/
export const getOffset = ({
  infoXY,
  mapWidthHeight,
  tooltipWidthHeight,
  offset1,
  offset2,
}) => {
  if (mapWidthHeight - infoXY >= tooltipWidthHeight + offset1 + TOOLTIP_BUFFER) {
    return offset1
  }
  if (infoXY >= tooltipWidthHeight + offset2 + TOOLTIP_BUFFER) {
    return offset2
  }
  if ((infoXY >= tooltipWidthHeight / 2 + TOOLTIP_BUFFER) &&
    (infoXY < tooltipWidthHeight + TOOLTIP_BUFFER) &&
    (mapWidthHeight - infoXY >= tooltipWidthHeight / 2 + TOOLTIP_BUFFER + CURSOR_BUFFER) &&
    (mapWidthHeight - infoXY < tooltipWidthHeight + TOOLTIP_BUFFER + CURSOR_BUFFER)) {
    return  Math.ceil(tooltipWidthHeight / 2)
  }
  return 0
}
