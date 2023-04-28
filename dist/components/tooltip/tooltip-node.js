"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lumenLabs = require("@eqworks/lumen-labs");

var _goober = require("goober");

var _stringFunctions = require("../../utils/string-functions");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _goober.setup)(_react["default"].createElement);
var TITLE_FONT_SIZE = 12;
var FONT_SIZE = 11;
var GAP = .625;
var TooltipTitle = (0, _goober.styled)('div')(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: space-between;\n  min-width: ", "rem;\n  gap: ", "rem;\n"])), function (_ref) {
  var width = _ref.width;
  return width;
}, GAP);
var TooltipTitleKey = (0, _goober.styled)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  font-weight: 600;\n  font-size: 0.75rem;\n  color: ", ";\n  min-width: ", "rem;\n  text-align: left;\n"])), (0, _lumenLabs.getTailwindConfigColor)('secondary-800'), function (_ref2) {
  var width = _ref2.width;
  return width;
});
var TooltipTitleValue = (0, _goober.styled)('div')(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  font-weight: 400;\n  font-size: 0.75rem;\n  min-width: ", "rem;\n  text-align: right;\n"])), function (_ref3) {
  var width = _ref3.width;
  return width;
});
var TooltipAttributes = (0, _goober.styled)('div')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: space-between;\n  min-width: ", "rem;\n  gap: ", "rem;\n"])), function (_ref4) {
  var width = _ref4.width;
  return width;
}, GAP);
var Key = (0, _goober.styled)('div')(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  font-weight: 400;\n  font-size: 0.6875rem;\n  color: ", ";\n  min-width: ", "rem;\n  text-align: left;\n"])), (0, _lumenLabs.getTailwindConfigColor)('secondary-700'), function (_ref5) {
  var width = _ref5.width;
  return width;
});
var Value = (0, _goober.styled)('div')(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  font-weight: 400;\n  font-size: 0.6875rem;\n  color: ", ";\n  min-width: ", "rem;\n  text-align: right;\n"])), (0, _lumenLabs.getTailwindConfigColor)('secondary-900'), function (_ref6) {
  var width = _ref6.width;
  return width;
});
var Line = (0, _goober.styled)('hr')(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  border-top: 0.0625rem solid ", ";\n  margin: 0.375rem 0rem;\n"])), (0, _lumenLabs.getTailwindConfigColor)('secondary-700'));
/**
 * tooltipNode - returns a node element with: name, id, and 'key: value' pairs for Tooltip component
 * @param { object } param
 * @param { object } param.tooltipKeys - object of attribute keys for Tooltip component
 * @param { function } param.formatDataKey - function to format data keys
 * @param { object } param.formatDataValue - object of data formatting for different key values
 * @param { function } param.formatTooltipTitle - function to format Tooltip title key
 * @param { function } param.formatTooltipValue - function to format Tooltip title value
 * @param { object } param.params - object of deck.gl onHover event
 * @returns { Node } - node element
 */

var tooltipNode = function tooltipNode(_ref7) {
  var _ref14, _ref15;

  var tooltipKeys = _ref7.tooltipKeys,
      _ref7$formatTooltipTi = _ref7.formatTooltipTitle,
      formatTooltipTitle = _ref7$formatTooltipTi === void 0 ? function (d) {
    return d;
  } : _ref7$formatTooltipTi,
      _ref7$formatTooltipTi2 = _ref7.formatTooltipTitleValue,
      formatTooltipTitleValue = _ref7$formatTooltipTi2 === void 0 ? function (d) {
    return d;
  } : _ref7$formatTooltipTi2,
      _ref7$formatDataKey = _ref7.formatDataKey,
      formatDataKey = _ref7$formatDataKey === void 0 ? function (d) {
    return d;
  } : _ref7$formatDataKey,
      _ref7$formatDataValue = _ref7.formatDataValue,
      formatDataValue = _ref7$formatDataValue === void 0 ? function (d) {
    return d;
  } : _ref7$formatDataValue,
      fontFamily = _ref7.fontFamily,
      params = _ref7.params;
  var tooltipTitle1 = tooltipKeys.tooltipTitle1,
      tooltipTitle2 = tooltipKeys.tooltipTitle2,
      metricKeys = tooltipKeys.metricKeys,
      _tooltipKeys$tooltipT = tooltipKeys.tooltipTitle1Accessor,
      tooltipTitle1Accessor = _tooltipKeys$tooltipT === void 0 ? function (d) {
    return d;
  } : _tooltipKeys$tooltipT,
      _tooltipKeys$tooltipT2 = tooltipKeys.tooltipTitle2Accessor,
      tooltipTitle2Accessor = _tooltipKeys$tooltipT2 === void 0 ? function (d) {
    return d;
  } : _tooltipKeys$tooltipT2,
      _tooltipKeys$metricAc = tooltipKeys.metricAccessor,
      metricAccessor = _tooltipKeys$metricAc === void 0 ? function (d) {
    return d;
  } : _tooltipKeys$metricAc,
      keyAliases = tooltipKeys.keyAliases;
  var titleKeyMaxWidth = [tooltipTitle1, tooltipTitle2].reduce(function (acc, key) {
    if (key) {
      acc = Math.max(acc, (0, _stringFunctions.getTextSize)("".concat((keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[key]) || formatTooltipTitle(key), ":"), 600, TITLE_FONT_SIZE, fontFamily).width);
    }

    return acc;
  }, 0);
  var keyMaxWidth = Object.entries(metricAccessor(params)).reduce(function (acc, _ref8) {
    var _ref9 = _slicedToArray(_ref8, 1),
        key = _ref9[0];

    if (metricKeys.includes(key)) {
      acc = Math.max(acc, (0, _stringFunctions.getTextSize)("".concat((keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[key]) || formatDataKey(key), ":"), 400, TITLE_FONT_SIZE, fontFamily).width);
    }

    return acc;
  }, titleKeyMaxWidth);
  var titleValMaxWidth = [tooltipTitle1, tooltipTitle2].reduce(function (acc, key) {
    var tooltipTitleAccessor = key === tooltipTitle1 ? tooltipTitle1Accessor : tooltipTitle2Accessor;

    if (key) {
      var _ref10;

      acc = Math.max(acc, (0, _stringFunctions.getTextSize)(formatTooltipTitleValue((_ref10 = (tooltipTitleAccessor || metricAccessor)(params)) === null || _ref10 === void 0 ? void 0 : _ref10[key]), 400, FONT_SIZE, fontFamily).width);
    }

    return acc;
  }, 0);
  var valMaxWidth = Object.entries(metricAccessor(params)).reduce(function (acc, _ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
        key = _ref12[0],
        value = _ref12[1];

    if (metricKeys.includes(key)) {
      acc = Math.max(acc, (0, _stringFunctions.getTextSize)(formatDataValue[key] ? formatDataValue[key](value) : value, 400, FONT_SIZE, fontFamily).width);
    }

    return acc;
  }, titleValMaxWidth);
  return /*#__PURE__*/_react["default"].createElement("div", null, [tooltipTitle1, tooltipTitle2].map(function (tooltipTitle, index) {
    var _ref13;

    var tooltipTitleAccessor = tooltipTitle === tooltipTitle1 ? tooltipTitle1Accessor : tooltipTitle2Accessor;
    return tooltipTitle && /*#__PURE__*/_react["default"].createElement(TooltipTitle, {
      width: keyMaxWidth + valMaxWidth + GAP,
      key: index
    }, /*#__PURE__*/_react["default"].createElement(TooltipTitleKey, {
      width: keyMaxWidth
    }, (keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[tooltipTitle]) || formatTooltipTitle(tooltipTitle), ":"), /*#__PURE__*/_react["default"].createElement(TooltipTitleValue, {
      width: valMaxWidth
    }, formatTooltipTitleValue((_ref13 = (tooltipTitleAccessor || metricAccessor)(params)) === null || _ref13 === void 0 ? void 0 : _ref13[tooltipTitle])));
  }), (tooltipTitle1 && ((_ref14 = (tooltipTitle1Accessor || metricAccessor)(params)) === null || _ref14 === void 0 ? void 0 : _ref14[tooltipTitle1]) || tooltipTitle2 && ((_ref15 = (tooltipTitle2Accessor || metricAccessor)(params)) === null || _ref15 === void 0 ? void 0 : _ref15[tooltipTitle2])) && (metricKeys === null || metricKeys === void 0 ? void 0 : metricKeys.length) > 0 && /*#__PURE__*/_react["default"].createElement(Line, null), (metricKeys === null || metricKeys === void 0 ? void 0 : metricKeys.length) > 0 && metricAccessor && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, Object.entries(metricAccessor(params)).map(function (_ref16) {
    var _ref17 = _slicedToArray(_ref16, 2),
        key = _ref17[0],
        value = _ref17[1];

    return metricKeys.includes(key) && /*#__PURE__*/_react["default"].createElement(TooltipAttributes, {
      key: key,
      width: keyMaxWidth + valMaxWidth + GAP
    }, /*#__PURE__*/_react["default"].createElement(Key, {
      width: keyMaxWidth
    }, (keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[key]) || formatDataKey(key), ":"), /*#__PURE__*/_react["default"].createElement(Value, {
      width: valMaxWidth
    }, formatDataValue[key] ? formatDataValue[key](value) : value));
  })));
};

var _default = tooltipNode;
exports["default"] = _default;