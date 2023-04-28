"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOffset = exports.getPosition = void 0;

var _constants = require("./../../constants");

/**
* getPosition - sets position of tooltip on the map, depending on how close to the map edge the tooltip is
* @param { object } param
* @param { number } param.infoinfoXY - cursor coordinate (x or y) value, in pixels
* @param { number } param.tooltipWidthHeightHeight - tooltip width or height, in pixels
* @param { number } param.viewportWidthHeight - viewport width or height, in pixels
* @param { number } param.offset - offset to apply, in pixels
* @returns { number } - tooltip position, left or top, in pixels
*/
var getPosition = function getPosition(_ref) {
  var infoXY = _ref.infoXY,
      tooltipWidthHeight = _ref.tooltipWidthHeight,
      viewportWidthHeight = _ref.viewportWidthHeight,
      offset = _ref.offset;

  if (viewportWidthHeight - infoXY > tooltipWidthHeight + _constants.CURSOR_BUFFER + 2 * _constants.TOOLTIP_BUFFER) {
    return "".concat(infoXY + offset, "px");
  }

  if (infoXY > tooltipWidthHeight + _constants.TOOLTIP_BUFFER + _constants.CURSOR_BUFFER_X) {
    return "".concat(infoXY - tooltipWidthHeight - offset, "px");
  }

  if (infoXY >= tooltipWidthHeight / 2 && viewportWidthHeight - infoXY >= tooltipWidthHeight / 2) {
    return "".concat(infoXY - offset, "px");
  }

  return "".concat(offset, "px");
};
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


exports.getPosition = getPosition;

var getOffset = function getOffset(_ref2) {
  var infoXY = _ref2.infoXY,
      mapWidthHeight = _ref2.mapWidthHeight,
      tooltipWidthHeight = _ref2.tooltipWidthHeight,
      offset1 = _ref2.offset1,
      offset2 = _ref2.offset2;

  if (mapWidthHeight - infoXY >= tooltipWidthHeight + offset1 + _constants.TOOLTIP_BUFFER) {
    return offset1;
  }

  if (infoXY >= tooltipWidthHeight + offset2 + _constants.TOOLTIP_BUFFER) {
    return offset2;
  }

  if (infoXY >= tooltipWidthHeight / 2 + _constants.TOOLTIP_BUFFER && infoXY < tooltipWidthHeight + _constants.TOOLTIP_BUFFER && mapWidthHeight - infoXY >= tooltipWidthHeight / 2 + _constants.TOOLTIP_BUFFER + _constants.CURSOR_BUFFER && mapWidthHeight - infoXY < tooltipWidthHeight + _constants.TOOLTIP_BUFFER + _constants.CURSOR_BUFFER) {
    return Math.ceil(tooltipWidthHeight / 2);
  }

  return 0;
};

exports.getOffset = getOffset;