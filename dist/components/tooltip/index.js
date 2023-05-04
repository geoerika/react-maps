"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _goober = require("goober");
var _utils = require("./utils");
var _hooks = require("../../hooks");
var _mapProps = require("../../shared/map-props");
var _constants = require("./../../constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(0, _goober.setup)(_react["default"].createElement);
var TooltipWrapper = (0, _goober.styled)('div', _react.forwardRef)(function (_ref) {
  var left = _ref.left,
    top = _ref.top,
    typography = _ref.typography,
    tooltipstyle = _ref.tooltipstyle;
  return _objectSpread(_objectSpread(_objectSpread({}, typography), tooltipstyle), {}, {
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'none',
    left: left,
    top: top,
    opacity: left && top ? tooltipstyle : 0
  });
});

// Tooltip component - general tooltip for maps
var Tooltip = function Tooltip(_ref2) {
  var info = _ref2.info,
    children = _ref2.children,
    typography = _ref2.typography,
    tooltipProps = _ref2.tooltipProps;
  var _useClientRect = (0, _hooks.useClientRect)(),
    _useClientRect2 = _slicedToArray(_useClientRect, 2),
    _useClientRect2$ = _useClientRect2[0],
    width = _useClientRect2$.width,
    height = _useClientRect2$.height,
    tooltipRef = _useClientRect2[1];

  // calculate left & top for tooltip position
  var _useMemo = (0, _react.useMemo)(function () {
      var _ref3 = (info === null || info === void 0 ? void 0 : info.viewport) || {},
        mapWidth = _ref3.width,
        mapHeight = _ref3.height;
      var left = 0,
        top = 0;
      if (width && height) {
        var offsetX = (0, _utils.getOffset)({
          infoXY: info.x,
          mapWidthHeight: mapWidth,
          tooltipWidthHeight: width,
          offset1: _constants.CURSOR_BUFFER,
          offset2: _constants.CURSOR_BUFFER_X
        });
        var offsetY = (0, _utils.getOffset)({
          infoXY: info.y,
          mapWidthHeight: mapHeight,
          tooltipWidthHeight: height,
          offset1: _constants.CURSOR_BUFFER + 2 * _constants.TOOLTIP_BUFFER,
          offset2: _constants.TOOLTIP_BUFFER
        });
        left = (0, _utils.getPosition)({
          infoXY: info.x,
          tooltipWidthHeight: width,
          viewportWidthHeight: mapWidth,
          offset: offsetX
        });
        top = (0, _utils.getPosition)({
          infoXY: info.y,
          tooltipWidthHeight: height,
          viewportWidthHeight: mapHeight,
          offset: offsetY
        });
      }
      return {
        left: left,
        top: top
      };
    }, [info, height, width]),
    left = _useMemo.left,
    top = _useMemo.top;
  return /*#__PURE__*/_react["default"].createElement(TooltipWrapper, {
    ref: tooltipRef,
    id: "tooltip",
    tooltipstyle: tooltipProps,
    info: info,
    left: left,
    top: top,
    typography: typography
  }, children);
};
Tooltip.propTypes = _objectSpread(_objectSpread({
  info: _propTypes["default"].object.isRequired,
  children: _propTypes["default"].element.isRequired
}, _mapProps.typographyPropTypes), _mapProps.tooltipPropTypes);
Tooltip.defaultProps = _objectSpread(_objectSpread({}, _mapProps.typographyDefaultProps), _mapProps.tooltipDefaultProps);
var _default = Tooltip;
exports["default"] = _default;