"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lumenLabs = require("@eqworks/lumen-labs");
var _goober = require("goober");
var _mapProps = require("../../shared/map-props");
var _legendItem = _interopRequireDefault(require("./legend-item"));
var _utils = require("./utils");
var _constants = require("../../constants");
var _excluded = ["type", "layerTitle"];
var _templateObject;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // TODO - make Legend comp more customizable by size, right now it is rigid
(0, _goober.setup)(_react["default"].createElement);
var LegendContainer = (0, _goober.styled)('div')(function (_ref) {
  var num_legends = _ref.num_legends,
    position = _ref.position,
    typography = _ref.typography,
    opacity = _ref.opacity;
  return _objectSpread(_objectSpread({}, typography), {}, {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '.375rem',
    position: 'absolute',
    cursor: num_legends > 1 ? 'pointer' : 'default',
    backgroundColor: (0, _lumenLabs.getTailwindConfigColor)('secondary-50'),
    padding: '.75rem .75rem .8125rem .75rem',
    borderRadius: '0.15rem',
    marginBottom: '1.5rem',
    boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
    opacity: opacity
  }, position);
});
var LayerTitle = (0, _goober.styled)('div', _react.forwardRef)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  font-weight: 700;\n  font-size: 0.75rem;\n  text-align: center;\n  max-width: ", "rem;\n  margin-bottom: 0.275rem;\n  margin-left: ", "rem;\n  overflow-wrap: break-word;\n  width: fit-content;\n"])), function (_ref2) {
  var maxwidth = _ref2.maxwidth;
  return maxwidth;
}, function (_ref3) {
  var titleleftmargin = _ref3.titleleftmargin;
  return titleleftmargin;
});
var Legend = function Legend(_ref4) {
  var legendPosition = _ref4.legendPosition,
    legendSize = _ref4.legendSize,
    legends = _ref4.legends,
    typography = _ref4.typography;
  // the largest offset / margin on the left side of the legend symbol due to underneath text width
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    symbolMarginLeft = _useState2[0],
    setSymbolMarginLeft = _useState2[1];
  // the largest offset on the right side of the legend symbol due to underneath text width
  var _useState3 = (0, _react.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    rightTextOffset = _useState4[0],
    setRightTextOffset = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    opacity = _useState6[0],
    setOpacity = _useState6[1];
  var layerTitleRef = (0, _react.useRef)(null);
  var objPosition = {};
  objPosition[legendPosition.split('-')[0]] = '.5rem';
  objPosition[legendPosition.split('-')[1]] = '.5rem';
  // const [activeLegend, setActiveLegend] = useState(0)
  // const handleLegendChange = () => setActiveLegend(o => o === legends.length - 1 ? 0 : o + 1)

  var font = (0, _utils.getCanvasFont)(layerTitleRef.current);
  var maxLegendWidth = (0, _react.useMemo)(function () {
    return Math.max(_constants.LEGEND_LAYER_MAX_WIDTH, symbolMarginLeft + _constants.LEGEND_SYMBOL_WIDTH[legendSize] + rightTextOffset);
  }, [symbolMarginLeft, legendSize, rightTextOffset]);
  var maxLayerTitleWidth = (0, _react.useMemo)(function () {
    return legends.reduce(function (acc, _ref5) {
      var layerTitle = _ref5.layerTitle;
      return Math.max(acc, Math.min(maxLegendWidth, (0, _utils.getTextWidth)(layerTitle, font) / _constants.FONT_SIZE));
    }, 0);
  }, [legends, font, maxLegendWidth]);
  var legendItemPadding = (0, _react.useMemo)(function () {
    return symbolMarginLeft <= (maxLayerTitleWidth - _constants.LEGEND_SYMBOL_WIDTH[legendSize]) / 2 ? (maxLayerTitleWidth - _constants.LEGEND_SYMBOL_WIDTH[legendSize]) / 2 - symbolMarginLeft : 0;
  }, [legendSize, maxLayerTitleWidth, symbolMarginLeft]);
  return /*#__PURE__*/_react["default"].createElement(LegendContainer, {
    id: "legend-container",
    num_legends: legends.length
    // onClick={handleLegendChange}
    ,
    position: objPosition,
    typography: legendSize === _constants.LEGEND_SIZE.large ? typography : _objectSpread(_objectSpread({}, typography), {}, {
      fontSize: '0.625rem'
    }),
    opacity: opacity,
    maxwidth: maxLegendWidth
  }, legends.map(function (_ref6, index) {
    var type = _ref6.type,
      layerTitle = _ref6.layerTitle,
      legendProps = _objectWithoutProperties(_ref6, _excluded);
    var layerTitleWidth = Math.min(maxLegendWidth, (0, _utils.getTextWidth)(layerTitle, font) / _constants.FONT_SIZE);
    var layerTitleLeftMargin = 0;
    if (symbolMarginLeft + legendItemPadding > (layerTitleWidth - _constants.LEGEND_SYMBOL_WIDTH[legendSize]) / 2) {
      layerTitleLeftMargin = symbolMarginLeft + legendItemPadding - layerTitleWidth / 2 + _constants.LEGEND_SYMBOL_WIDTH[legendSize] / 2;
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index
    }, layerTitle && /*#__PURE__*/_react["default"].createElement(LayerTitle, {
      ref: layerTitleRef,
      titleleftmargin: layerTitleLeftMargin,
      maxwidth: maxLegendWidth
    }, layerTitle), /*#__PURE__*/_react["default"].createElement(_legendItem["default"], {
      key: type,
      legendItemProps: _objectSpread(_objectSpread({
        type: type,
        legendSize: legendSize,
        symbolMarginLeft: symbolMarginLeft,
        setSymbolMarginLeft: setSymbolMarginLeft,
        rightTextOffset: rightTextOffset,
        setRightTextOffset: setRightTextOffset,
        setOpacity: setOpacity
      }, legendProps), {
        paddingLeft: legendItemPadding
      })
    }));
  }));
};
Legend.propTypes = _objectSpread({
  legendPosition: _propTypes["default"].oneOf(_toConsumableArray(_constants.LEGEND_POSITION)),
  legendSize: _propTypes["default"].oneOf(_toConsumableArray(Object.values(_constants.LEGEND_SIZE))),
  legends: _propTypes["default"].array.isRequired
}, _mapProps.typographyPropTypes);
Legend.defaultProps = _objectSpread({
  legendPosition: 'top-right',
  legendSize: _constants.LEGEND_SIZE.large
}, _mapProps.typographyDefaultProps);
var _default = Legend;
exports["default"] = _default;