"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCanvasFont = exports.getTextWidth = exports.getLegendItemDimensions = exports.getValueRangeWidth = exports.getElemWidth = exports.getLegendItemElements = void 0;

var _constants = require("../../constants");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * getLegendItemElements - returns legendElemWidth, title, minValue, maxValue for a legend
 * @param { object } param
 * @param { object } param.legendItemProps - object of legend item properties
 * @returns { object } - { legendElemWidth, title, minValue, maxValue } object of values for legend
 */
var getLegendItemElements = function getLegendItemElements(_ref) {
  var legendItemProps = _ref.legendItemProps;
  var min = legendItemProps.min,
      max = legendItemProps.max,
      label = legendItemProps.label,
      keyAliases = legendItemProps.keyAliases,
      _legendItemProps$form = legendItemProps.formatLegendTitle,
      formatLegendTitle = _legendItemProps$form === void 0 ? function (d) {
    return d;
  } : _legendItemProps$form,
      _legendItemProps$form2 = legendItemProps.formatDataKey,
      formatDataKey = _legendItemProps$form2 === void 0 ? function (d) {
    return d;
  } : _legendItemProps$form2,
      formatDataValue = legendItemProps.formatDataValue,
      legendSize = legendItemProps.legendSize;
  var legendElemWidth = min === max && min === 0 ? _constants.LEGEND_SYMBOL_WIDTH.zero : _constants.LEGEND_SYMBOL_WIDTH[legendSize];
  var title = formatLegendTitle((keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[label]) || formatDataKey(label));

  var _ref2 = formatDataValue !== null && formatDataValue !== void 0 && formatDataValue[label] ? [formatDataValue[label](min), formatDataValue[label](max)] : [min, max],
      _ref3 = _slicedToArray(_ref2, 2),
      minValue = _ref3[0],
      maxValue = _ref3[1];

  return {
    legendElemWidth: legendElemWidth,
    title: title,
    minValue: minValue,
    maxValue: maxValue
  };
};
/**
 * getElemWidth - returns the width of an element in rem units
 * @param { element } - elem - an element
 * @returns { number } - the element width in rem units
 */


exports.getLegendItemElements = getLegendItemElements;

var getElemWidth = function getElemWidth(elem) {
  var _elem$current, _elem$current$getBoun;

  return elem !== null && elem !== void 0 && (_elem$current = elem.current) !== null && _elem$current !== void 0 && (_elem$current$getBoun = _elem$current.getBoundingClientRect()) !== null && _elem$current$getBoun !== void 0 && _elem$current$getBoun.width ? (elem === null || elem === void 0 ? void 0 : elem.current.getBoundingClientRect().width) / _constants.FONT_SIZE : 0;
};
/**
 * getValueRangeWidth - returns the widths for the range values (rem)
 * @param { object } param
 * @param { object } param.textMin - ref to lower value in a legend item
 * @param { object } param.textMax - ref to higher value in a legend item
 * @param { object } param.lineTextMin - ref to lower value of line text legend item
 * @param { object } param.lineTextMax - ref to higher value of line text legend item
 * @returns { array } - array of legend item range value widths (rem)
 */


exports.getElemWidth = getElemWidth;

var getValueRangeWidth = function getValueRangeWidth(_ref4) {
  var textMin = _ref4.textMin,
      textMax = _ref4.textMax,
      lineTextMin = _ref4.lineTextMin,
      lineTextMax = _ref4.lineTextMax;
  return [getElemWidth(textMin), getElemWidth(textMax), Math.max(getElemWidth(lineTextMin), getElemWidth(lineTextMax))];
};
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


exports.getValueRangeWidth = getValueRangeWidth;

var getLegendItemDimensions = function getLegendItemDimensions(_ref5) {
  var legendItemProps = _ref5.legendItemProps,
      legendElemWidth = _ref5.legendElemWidth,
      textMinWidth = _ref5.textMinWidth,
      textMaxWidth = _ref5.textMaxWidth,
      legendSize = _ref5.legendSize;
  var min = legendItemProps.min,
      max = legendItemProps.max,
      type = legendItemProps.type,
      dots = legendItemProps.dots,
      size = legendItemProps.size;
  /*
   * text container width for gradient and elevation legends, where value label centres align with
   * the edges of the legend symbol container
   */

  var minTextContainerWidth = textMinWidth + textMaxWidth + _constants.LEGEND_TEXT_GAP;
  var textContainerWidth = min !== max && textMinWidth && textMaxWidth ? Math.max((textMinWidth + textMaxWidth) / 2 + legendElemWidth, minTextContainerWidth) : textMinWidth || 0;
  var symbolContainerLeftMargin = 0;
  var textContainerLeftMargin = 0;

  if (min !== max && textMinWidth && ![_constants.LEGEND_TYPE.size, _constants.LEGEND_TYPE.lineWidth].includes(type)) {
    if (legendElemWidth >= (textMinWidth + textMaxWidth) / 2 + _constants.LEGEND_TEXT_GAP || textMinWidth + _constants.LEGEND_TEXT_GAP <= legendElemWidth) {
      symbolContainerLeftMargin = textMinWidth / 2;
    } else if (textMinWidth > textMaxWidth && textMaxWidth + _constants.LEGEND_TEXT_GAP <= legendElemWidth) {
      symbolContainerLeftMargin = Math.max(textMinWidth - legendElemWidth + textMaxWidth / 2 + _constants.LEGEND_TEXT_GAP, textMinWidth / 2 + _constants.LEGEND_TEXT_GAP);
    } else {
      symbolContainerLeftMargin = textMinWidth - (legendElemWidth - _constants.LEGEND_TEXT_GAP) / 2;
    }
  }

  if (min !== max && textMinWidth && type === _constants.LEGEND_TYPE.size) {
    /*
     * for radius (size) text width is more complex to calculate, as the value labels align with the
     * centers of the edge circles
     */
    var smallSymbolRadius = !isNaN(size) && size ? 1.75 * size / 2 : 0;
    var largeCircleIndex = 0;

    if (dots) {
      largeCircleIndex = dots - 1;
    } else if (legendSize === _constants.LEGEND_SIZE.large) {
      largeCircleIndex = _constants.LEGEND_DOTS.large - 1;
    } else {
      largeCircleIndex = _constants.LEGEND_DOTS.small - 1;
    }

    var largeSymbolRadius = !isNaN(size) && size ? (largeCircleIndex + 1.75) * size / 2 : 0;
    textContainerWidth = Math.max(legendElemWidth - smallSymbolRadius - largeSymbolRadius + (textMinWidth + textMaxWidth) / 2, minTextContainerWidth);

    if (smallSymbolRadius <= textMinWidth / 2) {
      if (legendElemWidth - smallSymbolRadius - largeSymbolRadius >= (textMinWidth + textMaxWidth) / 2 + _constants.LEGEND_TEXT_GAP || textMinWidth + _constants.LEGEND_TEXT_GAP - 2 * smallSymbolRadius <= legendElemWidth) {
        symbolContainerLeftMargin = textMinWidth / 2 - smallSymbolRadius;
      } else if (textMinWidth > textMaxWidth && (textMaxWidth + _constants.LEGEND_TEXT_GAP) / 2 <= legendElemWidth / 2 - largeSymbolRadius) {
        symbolContainerLeftMargin = Math.max(textMinWidth - legendElemWidth + textMaxWidth / 2 + _constants.LEGEND_TEXT_GAP + largeSymbolRadius, textMinWidth / 2 + _constants.LEGEND_TEXT_GAP - smallSymbolRadius);
      } else {
        symbolContainerLeftMargin = textMinWidth - (legendElemWidth - _constants.LEGEND_TEXT_GAP) / 2;
      }
    } else {
      textContainerLeftMargin = smallSymbolRadius - textMinWidth / 2;
    }
  }

  return {
    textContainerWidth: textContainerWidth,
    symbolContainerLeftMargin: symbolContainerLeftMargin,
    textContainerLeftMargin: textContainerLeftMargin
  };
};
/**
 * getTextWidth - uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * @param { string } text - the text to be rendered.
 * @param { string } font - the css font descriptor that text is to be rendered with (e.g. 'bold 14px verdana').
 * @returns { number } - the width of the text in px
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */


exports.getLegendItemDimensions = getLegendItemDimensions;

var getTextWidth = function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
};
/**
 * getCssStyle - gets css styling for an element
 * @param { element } element - an element
 * @param { string } prop - the css property to retrieve
 * @returns { number || string } - the value of a css property
 */


exports.getTextWidth = getTextWidth;

var getCssStyle = function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
};
/**
 * getCanvasFont - gets font weight, size, & family for an element
 * @param { element } el - an element
 * @returns { string } - concatenated string of font weight, size, & family for an element
 */


var getCanvasFont = function getCanvasFont() {
  var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.documentElement;

  if (!el) {
    return '';
  }

  var fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  var fontSize = getCssStyle(el, 'font-size') || '16px';
  var fontFamily = getCssStyle(el, 'font-family').split(',')[0] || 'Times New Roman';
  return "".concat(fontWeight, " ").concat(fontSize, " ").concat(fontFamily);
};

exports.getCanvasFont = getCanvasFont;