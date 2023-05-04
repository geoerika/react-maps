"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lumenLabs = require("@eqworks/lumen-labs");
var _goober = require("goober");
var _legendSymbol = _interopRequireDefault(require("./legend-symbol"));
var _utils = require("./utils");
var _constants = require("../../constants");
var _excluded = ["min", "max", "type", "legendSize", "symbolMarginLeft", "setSymbolMarginLeft", "rightTextOffset", "setRightTextOffset", "paddingLeft", "setOpacity"];
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
(0, _goober.setup)(_react["default"].createElement);
var LegendBody = (0, _goober.styled)('div')(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  align-items: center;\n  padding-left: ", "rem;\n"])), function (_ref) {
  var padding = _ref.padding;
  return padding;
});
var LegendTitle = (0, _goober.styled)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin:  ", ";\n  text-align: center;\n  font-weight: 700;\n  font-size: 0.625rem;\n  color: ", ";\n  max-width: ", "rem;\n  overflow-wrap: anywhere;\n"])), function (_ref2) {
  var marginbottom = _ref2.marginbottom,
    marginleft = _ref2.marginleft;
  return "0 auto ".concat(marginbottom, "rem ").concat(marginleft, "rem");
}, (0, _lumenLabs.getTailwindConfigColor)('secondary-900'), function (_ref3) {
  var legendelemwidth = _ref3.legendelemwidth;
  return legendelemwidth;
});
var LegendElements = (0, _goober.styled)('div')(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  margin-left: ", "rem;\n  ", ";\n"])), function (_ref4) {
  var legendelementsleftmargin = _ref4.legendelementsleftmargin;
  return legendelementsleftmargin;
}, function (_ref5) {
  var min = _ref5.min,
    max = _ref5.max;
  return min || max ? '' : 'align-items: center';
});
var LegendTextContainer = (0, _goober.styled)('div')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  gap: ", "rem;\n  width: ", "rem;\n  margin-left: ", "rem;\n  margin-top: 0.325rem;\n"])), _constants.LEGEND_TEXT_GAP, function (_ref6) {
  var textcontainerwidth = _ref6.textcontainerwidth;
  return textcontainerwidth;
}, function (_ref7) {
  var textcontainerleftmargin = _ref7.textcontainerleftmargin;
  return textcontainerleftmargin;
});
var LegendTextMin = (0, _goober.styled)('div', _react.forwardRef)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  font-size: 0.625rem;\n  color: black;\n  marginBottom: 0.1rem;\n  color: ", ";\n"])), (0, _lumenLabs.getTailwindConfigColor)('secondary-900'));
var LegendTextMax = (0, _goober.styled)('div', _react.forwardRef)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  font-size: 0.625rem;\n  color: black;\n  color: ", ";\n"])), (0, _lumenLabs.getTailwindConfigColor)('secondary-900'));
var LegendSymbolContainer = (0, _goober.styled)('div')(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  width: ", "rem;\n  margin-left: ", "rem;\n"])), function (_ref8) {
  var legendelemwidth = _ref8.legendelemwidth;
  return legendelemwidth;
}, function (_ref9) {
  var symbolcontainerleftmargin = _ref9.symbolcontainerleftmargin;
  return symbolcontainerleftmargin;
});
var LegendLineWidth = (0, _goober.styled)('div')(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  width: ", "rem;\n  margin-left: ", "rem;\n"])), function (_ref10) {
  var legendelemwidth = _ref10.legendelemwidth;
  return legendelemwidth;
}, function (_ref11) {
  var legendelementsleftmargin = _ref11.legendelementsleftmargin;
  return legendelementsleftmargin;
});
var LineWidthTextContainer = (0, _goober.styled)('div')(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  width: ", "rem;\n  margin-left: ", "rem;\n"])), function (_ref12) {
  var textcontainerwidth = _ref12.textcontainerwidth;
  return textcontainerwidth;
}, function (_ref13) {
  var textcontainerleftmargin = _ref13.textcontainerleftmargin;
  return textcontainerleftmargin;
});
var LegendItem = function LegendItem(_ref14) {
  var legendItemProps = _ref14.legendItemProps;
  var min = legendItemProps.min,
    max = legendItemProps.max,
    type = legendItemProps.type,
    legendSize = legendItemProps.legendSize,
    symbolMarginLeft = legendItemProps.symbolMarginLeft,
    setSymbolMarginLeft = legendItemProps.setSymbolMarginLeft,
    rightTextOffset = legendItemProps.rightTextOffset,
    setRightTextOffset = legendItemProps.setRightTextOffset,
    paddingLeft = legendItemProps.paddingLeft,
    setOpacity = legendItemProps.setOpacity,
    symbolProps = _objectWithoutProperties(legendItemProps, _excluded);
  var _getLegendItemElement = (0, _utils.getLegendItemElements)({
      legendItemProps: legendItemProps
    }),
    legendElemWidth = _getLegendItemElement.legendElemWidth,
    title = _getLegendItemElement.title,
    minValue = _getLegendItemElement.minValue,
    maxValue = _getLegendItemElement.maxValue;
  var textMin = (0, _react.useRef)(null);
  var textMax = (0, _react.useRef)(null);
  var lineTextMin = (0, _react.useRef)(null);
  var lineTextMax = (0, _react.useRef)(null);
  var _getValueRangeWidth = (0, _utils.getValueRangeWidth)({
      textMin: textMin,
      textMax: textMax,
      lineTextMin: lineTextMin,
      lineTextMax: lineTextMax
    }),
    _getValueRangeWidth2 = _slicedToArray(_getValueRangeWidth, 3),
    textMinWidth = _getValueRangeWidth2[0],
    textMaxWidth = _getValueRangeWidth2[1],
    lineTextMaxWidth = _getValueRangeWidth2[2];
  var _getLegendItemDimensi = (0, _utils.getLegendItemDimensions)({
      legendItemProps: legendItemProps,
      legendElemWidth: legendElemWidth,
      textMinWidth: textMinWidth,
      textMaxWidth: textMaxWidth,
      legendSize: legendSize
    }),
    textContainerWidth = _getLegendItemDimensi.textContainerWidth,
    symbolContainerLeftMargin = _getLegendItemDimensi.symbolContainerLeftMargin,
    textContainerLeftMargin = _getLegendItemDimensi.textContainerLeftMargin;

  // set symbolMarginLeft as the maxium left margin value of all legend item symbols
  (0, _react.useEffect)(function () {
    if (symbolContainerLeftMargin && type !== _constants.LEGEND_TYPE.lineWidth) {
      setSymbolMarginLeft(function (prev) {
        return Math.max(prev, symbolContainerLeftMargin);
      });
    }
  }, [symbolContainerLeftMargin, setSymbolMarginLeft, type]);

  // sets the maximum width of the upper data range text in all legends, except for line width legend
  (0, _react.useEffect)(function () {
    if (type !== _constants.LEGEND_TYPE.lineWidth) {
      if ([_constants.LEGEND_TYPE.gradient, _constants.LEGEND_TYPE.elevation].includes(type)) {
        setRightTextOffset(function (prev) {
          return Math.max(prev, textMaxWidth / 2, textMaxWidth - legendElemWidth / 2 - _constants.LEGEND_TEXT_GAP / 2);
        });
      }
      if (type === _constants.LEGEND_TYPE.size) {
        var circleRadius = (_constants.LEGEND_DOTS[legendSize] + 0.75) * (symbolProps.size || _constants.LEGEND_RADIUS_SIZE["default"]) / 2;
        if (circleRadius < textMaxWidth / 2) {
          setRightTextOffset(function (prev) {
            return Math.max(prev, textMaxWidth / 2 - circleRadius, textMaxWidth - legendElemWidth / 2 - _constants.LEGEND_TEXT_GAP / 2);
          });
        }
      }
    }
  }, [type, textMaxWidth, setRightTextOffset, legendElemWidth, legendSize, symbolProps.size]);

  // adjust LegendElement left margin so the legend symbols of all legends align vertically
  var legendElementsLeftMargin = (0, _react.useMemo)(function () {
    if (symbolMarginLeft > symbolContainerLeftMargin) {
      return symbolMarginLeft - symbolContainerLeftMargin;
    }
    return 0;
  }, [symbolMarginLeft, symbolContainerLeftMargin]);

  // reveal Legend only after the textContainerWidth has been calculated
  (0, _react.useEffect)(function () {
    if (textContainerWidth || min === undefined && max === undefined) {
      setOpacity(0.9);
    }
  }, [textContainerWidth, setOpacity, min, max]);
  var legendTitleMarginBottom = (0, _react.useMemo)(function () {
    if (type === _constants.LEGEND_TYPE.lineWidth) {
      return _constants.LEGEND_TITLE_BOTTOM_MARGIN.lineWidth;
    }
    return _constants.LEGEND_TITLE_BOTTOM_MARGIN["default"];
  }, [type]);
  var lineWidthSymbolContainerWidth = (0, _react.useMemo)(function () {
    if (rightTextOffset && rightTextOffset >= lineTextMaxWidth + _constants.LEGEND_TEXT_GAP) {
      return legendElemWidth;
    }
    return Math.max(_constants.MIN_LEGEND_LINE_WIDTH, legendElemWidth + rightTextOffset - lineTextMaxWidth - _constants.LEGEND_TEXT_GAP);
  }, [rightTextOffset, lineTextMaxWidth, legendElemWidth]);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, max !== undefined && min !== undefined && /*#__PURE__*/_react["default"].createElement(LegendBody, {
    id: "legend-body",
    padding: paddingLeft
  }, /*#__PURE__*/_react["default"].createElement(LegendTitle, {
    id: "legend-title",
    legendelemwidth: _constants.LEGEND_SYMBOL_WIDTH[legendSize],
    marginbottom: legendTitleMarginBottom,
    marginleft: legendElementsLeftMargin + symbolContainerLeftMargin
  }, title), type !== _constants.LEGEND_TYPE.lineWidth && /*#__PURE__*/_react["default"].createElement(LegendElements, {
    id: "legend-element",
    min: min,
    max: max,
    legendelementsleftmargin: legendElementsLeftMargin
  }, /*#__PURE__*/_react["default"].createElement(LegendSymbolContainer, {
    legendelemwidth: legendElemWidth,
    symbolcontainerleftmargin: symbolContainerLeftMargin
  }, /*#__PURE__*/_react["default"].createElement(_legendSymbol["default"], {
    symbolProps: _objectSpread({
      min: min,
      max: max,
      type: type,
      legendSize: legendSize
    }, symbolProps)
  })), /*#__PURE__*/_react["default"].createElement(LegendTextContainer, {
    textcontainerwidth: textContainerWidth,
    textcontainerleftmargin: textContainerLeftMargin
  }, /*#__PURE__*/_react["default"].createElement(LegendTextMin, {
    ref: textMin
  }, minValue.toLocaleString()), min !== max && /*#__PURE__*/_react["default"].createElement(LegendTextMax, {
    ref: textMax
  }, maxValue.toLocaleString()))), type === _constants.LEGEND_TYPE.lineWidth && /*#__PURE__*/_react["default"].createElement(LegendLineWidth, {
    legendelementsleftmargin: legendElementsLeftMargin,
    legendelemwidth: lineWidthSymbolContainerWidth + lineTextMaxWidth + _constants.LEGEND_TEXT_GAP
  }, /*#__PURE__*/_react["default"].createElement(LegendSymbolContainer, {
    symbolcontainerleftmargin: symbolContainerLeftMargin,
    legendelemwidth: lineWidthSymbolContainerWidth
  }, /*#__PURE__*/_react["default"].createElement(_legendSymbol["default"], {
    symbolProps: _objectSpread({
      max: max,
      min: min,
      type: type,
      legendSize: legendSize
    }, symbolProps)
  })), /*#__PURE__*/_react["default"].createElement(LineWidthTextContainer, {
    textcontainerleftmargin: _constants.LEGEND_TEXT_GAP
  }, min !== max && /*#__PURE__*/_react["default"].createElement(LegendTextMin, {
    ref: lineTextMin
  }, minValue.toLocaleString()), /*#__PURE__*/_react["default"].createElement(LegendTextMax, {
    ref: lineTextMax
  }, maxValue.toLocaleString())))), min === undefined && max === undefined && type === _constants.LEGEND_TYPE.icon && /*#__PURE__*/_react["default"].createElement(LegendSymbolContainer, {
    legendelemwidth: legendElemWidth,
    symbolcontainerleftmargin: symbolMarginLeft + paddingLeft
  }, /*#__PURE__*/_react["default"].createElement(_legendSymbol["default"], {
    symbolProps: _objectSpread({
      max: max,
      type: type,
      legendSize: legendSize
    }, symbolProps)
  })));
};
LegendItem.propTypes = {
  legendItemProps: _propTypes["default"].shape({
    label: _propTypes["default"].string,
    max: _propTypes["default"].number,
    min: _propTypes["default"].number,
    keyAliases: _propTypes["default"].object,
    formatLegendTitle: _propTypes["default"].func,
    formatDataKey: _propTypes["default"].func,
    formatDataValue: _propTypes["default"].object,
    type: _propTypes["default"].string.isRequired,
    legendSize: _propTypes["default"].string.isRequired,
    symbolProps: _propTypes["default"].object,
    symbolMarginLeft: _propTypes["default"].number.isRequired,
    setSymbolMarginLeft: _propTypes["default"].func.isRequired,
    paddingLeft: _propTypes["default"].number,
    setOpacity: _propTypes["default"].func.isRequired,
    rightTextOffset: _propTypes["default"].number.isRequired,
    setRightTextOffset: _propTypes["default"].func.isRequired
  })
};
LegendItem.defaultProps = {
  legendItemProps: {
    label: '',
    max: undefined,
    min: undefined,
    keyAliases: undefined,
    formatLegendTitle: function formatLegendTitle(d) {
      return d;
    },
    formatDataKey: function formatDataKey(d) {
      return d;
    },
    formatDataValue: undefined,
    symbolProps: undefined,
    paddingLeft: 0
  }
};
var _default = LegendItem;
exports["default"] = _default;