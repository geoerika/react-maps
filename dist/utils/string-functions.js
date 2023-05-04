"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncate = exports.getTextSize = void 0;
var _constants = require("../constants");
/**
 * truncate - returns formatted string, by truncating to a certain nr of characters
 * @param { string } fullStr - string to format
 * @param { number } strLen - length of formatted string
 * @param { string } separator - string to separate formatted string
 * @returns { string } - formatted string
 */
var truncate = function truncate(fullStr, strLen) {
  var _fullStr$toString, _fullStr$toString2;
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ... ';
  if (fullStr.toString().length <= strLen) {
    return fullStr;
  }
  var sepLen = separator.length;
  var charsToShow = strLen - sepLen;
  var frontChars = Math.ceil(charsToShow / 2);
  var endChars = Math.floor(charsToShow / 2);
  return ((_fullStr$toString = fullStr.toString()) === null || _fullStr$toString === void 0 ? void 0 : _fullStr$toString.substring(0, frontChars)) + separator + ((_fullStr$toString2 = fullStr.toString()) === null || _fullStr$toString2 === void 0 ? void 0 : _fullStr$toString2.substring(fullStr.length + 1 - endChars));
};

// "vendored" from https://github.com/mdevils/html-entities/blob/68a1a96/src/xml-entities.ts
exports.truncate = truncate;
var decodeXML = function decodeXML(str) {
  var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
  };
  if (!str || !str.length) {
    return '';
  }
  return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
    if (s.charAt(1) === '#') {
      var code = s.charAt(2).toLowerCase() === 'x' ? parseInt(s.substr(3), 16) : parseInt(s.substr(2));
      if (isNaN(code) || code < -32768 || code > 65535) {
        return '';
      }
      return String.fromCharCode(code);
    }
    return ALPHA_INDEX[s] || s;
  });
};

/**
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/50813259#50813259
 * getTextSize - calculates a rendered text width and height in rem
 * @param { string } text - a text string
 * @param { number || string } fontWeight - text's font weight
 * @param { number } fontSize - text's font size in pixels
 * @param { string } fontFamily - text's font family
 * @returns { object } - the width and height of the rendered text in rem
 */
var getTextSize = function getTextSize(text, fontWeight, fontSize, fontFamily) {
  var font = "".concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = typeof text === 'number' ? context.measureText(text) : context.measureText(decodeXML(text));
  return {
    width: Math.ceil(metrics.width / _constants.FONT_SIZE * 100) / 100,
    height: (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / _constants.FONT_SIZE * 100 / 100
  };
};
exports.getTextSize = getTextSize;