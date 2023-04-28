"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validColor = exports.getArrayGradientFillColors = exports.arrayToRGBAStrColor = exports.getArrayFillColors = exports.strToArrayColor = void 0;

var _d3Color = require("d3-color");

/**
 * strToArrayColor - transforms a string format color ex.'#0062d9' into an array of rgb color values
 * @param { object } param
 * @param { string } param.strColor - string format color
 * @returns { array  } - an array of rgb color values [r, g, b]
 */
var strToArrayColor = function strToArrayColor(_ref) {
  var strColor = _ref.strColor;
  var layerColor = (0, _d3Color.color)(strColor);
  return [layerColor.r, layerColor.g, layerColor.b];
};
/**
 * getArrayFillColors - converts an array of string format colour in array format
 * @param { object } param
 * @param { string } param.fillColors - array of string format colours ['#0062d9', '#dd196b']
 * @returns { array } - array format colour [[r, g, b]]
 */


exports.strToArrayColor = strToArrayColor;

var getArrayFillColors = function getArrayFillColors(_ref2) {
  var fillColors = _ref2.fillColors;
  return fillColors.map(function (strColor) {
    return strToArrayColor({
      strColor: strColor
    });
  });
};
/**
* arrayToRGBAStrColor - converts an array format colour [r, g, b] in a string format colour
* @param { object } param
* @param { array || function } param.color - function or array of Deck.gl layer fill colours
* @param { string } param.opacity - opacity value
* @returns { array } - string format colour 'rgb(r, g, b, opacity)'
*/


exports.getArrayFillColors = getArrayFillColors;

var arrayToRGBAStrColor = function arrayToRGBAStrColor(_ref3) {
  var color = _ref3.color,
      _ref3$opacity = _ref3.opacity,
      opacity = _ref3$opacity === void 0 ? 1 : _ref3$opacity;
  var finalColor = typeof color === 'function' ? color(0)(1) : color;
  return "rgba(".concat(finalColor[0], ", ").concat(finalColor[1], ", ").concat(finalColor[2], ", ").concat(opacity, ")");
};
/**
* getArrayGradientFillColors - converts an array of string or array format colours
* in an array of rgba string format colours
* @param { object } param
* @param { array } param.fillColors - array of string or array format colours
                                      ex: ['#0062d9', '#dd196b'] or [[214, 232, 253], [39, 85, 196]]
* @param { string } param.opacity - opacity value
* @returns { array } - array of rgba string format colours ['rgb(r, g, b, opacity)']
*/


exports.arrayToRGBAStrColor = arrayToRGBAStrColor;

var getArrayGradientFillColors = function getArrayGradientFillColors(_ref4) {
  var fillColors = _ref4.fillColors,
      opacity = _ref4.opacity;
  return fillColors.map(function (strColor) {
    var arrayColor = Array.isArray(strColor) ? strColor : strToArrayColor({
      strColor: strColor
    });
    return "rgba(".concat(arrayColor[0], ", ").concat(arrayColor[1], ", ").concat(arrayColor[2], ", ").concat(opacity, ")");
  });
};
/**
* validColor - checks if a string or array color is a valid color value
* @param { string || array } - a color param that can be either a string or an array
* @returns { boolean } - whether a color is a valid color string or rgb array
*/


exports.getArrayGradientFillColors = getArrayGradientFillColors;

var validColor = function validColor(color) {
  // case for hex values, ex: #d0d0ce
  if (typeof color === 'string') {
    var _color$match;

    return Boolean((_color$match = color.match(/^#[0-9a-fA-F]{6}$/g)) === null || _color$match === void 0 ? void 0 : _color$match[0]);
  } // case for array color ex: [165, 42, 42]


  if (Array.isArray(color)) {
    if (color.length === 3) {
      return color.every(function (el) {
        return el >= 0 && el <= 255 && Number.isInteger(el);
      });
    }

    if (color.length === 4) {
      return color.every(function (el, i) {
        return i < 3 && el >= 0 && el <= 255 && Number.isInteger(el) || i === 3 && el >= 0 && el <= 1;
      });
    }
  }

  return false;
};

exports.validColor = validColor;