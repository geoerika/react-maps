"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useDebounce3 = require("use-debounce");
var _mapProps = require("../shared/map-props");
var _core = require("@deck.gl/core");
var _react2 = require("@deck.gl/react");
var _reactMapGl = require("react-map-gl");
var _goober = require("goober");
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
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // https://deck.gl/docs/whats-new#use-react-map-gl-components-with-deckgl
(0, _goober.setup)(_react["default"].createElement);
var MapContainer = (0, _goober.styled)('div')({
  height: '100%',
  width: '100%',
  position: 'absolute'
});
var NavigationContainer = (0, _goober.styled)('div')(function (_ref) {
  var position = _ref.position;
  return _objectSpread({
    position: 'absolute',
    zIndex: 1
  }, position);
});
var MAP_VIEW = new _core.MapView({
  repeat: true
});
var INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 1000,
  transitionInterpolator: new _core.FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5
};

// DeckGL react component
var Map = function Map(_ref2) {
  var layers = _ref2.layers,
    setDimensionsCb = _ref2.setDimensionsCb,
    setHighlightObj = _ref2.setHighlightObj,
    getTooltip = _ref2.getTooltip,
    getCursor = _ref2.getCursor,
    viewStateOverride = _ref2.viewStateOverride,
    legend = _ref2.legend,
    legendPosition = _ref2.legendPosition,
    onHover = _ref2.onHover,
    _onClick = _ref2.onClick,
    showTooltip = _ref2.showTooltip,
    renderTooltip = _ref2.renderTooltip,
    pitch = _ref2.pitch,
    initViewState = _ref2.initViewState,
    setZoom = _ref2.setZoom,
    setCurrentViewport = _ref2.setCurrentViewport,
    setProcessingMapData = _ref2.setProcessingMapData,
    setInInteractiveState = _ref2.setInInteractiveState,
    controller = _ref2.controller,
    mapboxApiAccessToken = _ref2.mapboxApiAccessToken;
  var _useState = (0, _react.useState)(_objectSpread(_objectSpread(_objectSpread({}, INIT_VIEW_STATE), initViewState), {}, {
      pitch: pitch
    })),
    _useState2 = _slicedToArray(_useState, 2),
    mapViewState = _useState2[0],
    setMapViewState = _useState2[1];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    _useState4$ = _useState4[0],
    height = _useState4$.height,
    width = _useState4$.width,
    setDimensions = _useState4[1];
  var _useState5 = (0, _react.useState)({}),
    _useState6 = _slicedToArray(_useState5, 2),
    hoverInfo = _useState6[0],
    setHoverInfo = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    inTransition = _useState8[0],
    setInTransition = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    render = _useState10[0],
    setRender = _useState10[1];
  var _useDebounce = (0, _useDebounce3.useDebounce)(inTransition || render, 300),
    _useDebounce2 = _slicedToArray(_useDebounce, 1),
    inInteractiveState = _useDebounce2[0];
  (0, _react.useEffect)(function () {
    return setInInteractiveState(inInteractiveState);
  }, [inInteractiveState, setInInteractiveState]);
  var navigationPosition = (0, _react.useMemo)(function () {
    var _ref3 = [],
      right = _ref3[0],
      left = _ref3[1];
    if (legendPosition.split('-')[0] === 'bottom' && legendPosition.split('-')[1] === 'left') {
      right = '2.35rem';
    } else {
      left = '0.5rem';
    }
    return Object.freeze({
      bottom: '5.75rem',
      right: right,
      left: left
    });
  }, [legendPosition]);

  /*
   * we have to keep updating mapViewState in separate useEffect hooks as all props used to update
   * are independent of each other and are intended to be applied on the current mapViewState value
   */

  // initViewState is received externally in react-maps components
  (0, _react.useEffect)(function () {
    if (initViewState && _typeof(initViewState) === 'object' && !Array.isArray(initViewState)) {
      setMapViewState(function (o) {
        return _objectSpread(_objectSpread({}, o), initViewState);
      });
    }
  }, [initViewState]);

  // viewStateOverride is received from a react-maps map component
  (0, _react.useEffect)(function () {
    return setMapViewState(function (o) {
      return _objectSpread(_objectSpread({}, o), viewStateOverride);
    });
  }, [viewStateOverride]);

  // pitch is applied when we have elevation and can be passed on either externally or internally in react-maps
  (0, _react.useEffect)(function () {
    if (!Number.isNaN(pitch)) {
      setMapViewState(function (o) {
        return _objectSpread(_objectSpread({}, o), {}, {
          pitch: pitch
        });
      });
    }
  }, [pitch]);

  /**
   * finalOnHover - React hook that handles the onHover event for deck.gl map
   * @param { object } param - object of deck.gl onHover event
   * @param { object } param.hoverInfo - info of hovered object on map
   */
  var finalOnHover = (0, _react.useCallback)(function (hoverInfo) {
    if (onHover) {
      onHover(hoverInfo);
    }
    if (showTooltip && hoverInfo !== null && hoverInfo !== void 0 && hoverInfo.object) {
      setHoverInfo(hoverInfo);
    } else {
      setHoverInfo(null);
    }
  }, [onHover, showTooltip]);
  return /*#__PURE__*/_react["default"].createElement(MapContainer, null, /*#__PURE__*/_react["default"].createElement(_react2.DeckGL, {
    ContextProvider: _reactMapGl._MapContext.Provider,
    onResize: function onResize(_ref4) {
      var height = _ref4.height,
        width = _ref4.width;
      setDimensionsCb({
        height: height,
        width: width
      });
      setDimensions({
        height: height,
        width: width
      });
    },
    onViewStateChange: function onViewStateChange(o) {
      var viewState = o.viewState,
        interactionState = o.interactionState;
      if (!interactionState) {
        return; // "hack" to allow MapContext/NavigationControl take over
      }

      var isDragging = interactionState.isDragging,
        isZooming = interactionState.isZooming,
        isPanning = interactionState.isPanning,
        isRotating = interactionState.isRotating,
        inTransition = interactionState.inTransition;
      if (inTransition) {
        setInTransition(true);
      }
      // makes tooltip info disappear when we click and zoom in on a location
      setHoverInfo(null);
      // send zoom and viewState to parent comp
      if ([isDragging, isZooming, isPanning, isRotating].every(function (action) {
        return !action;
      })) {
        setZoom(viewState.zoom);
        setCurrentViewport(viewState);
      }
      // reset highlightObj when we are actively interacting with the map in other ways
      if ([isDragging, isZooming, isPanning, isRotating].some(function (action) {
        return !action;
      })) {
        setHighlightObj(null);
      }
      setMapViewState(function (o) {
        return _objectSpread(_objectSpread(_objectSpread({}, o), viewState), {}, {
          // viewState overrides some of INIT_VIEW_STATE props we would like to keep
          transitionDuration: INIT_VIEW_STATE.transitionDuration,
          transitionInterpolator: INIT_VIEW_STATE.transitionInterpolator
        });
      });
    },
    onInteractionStateChange: function onInteractionStateChange(interactionState) {
      var isDragging = interactionState.isDragging,
        inTransition = interactionState.inTransition,
        isZooming = interactionState.isZooming,
        isPanning = interactionState.isPanning,
        isRotating = interactionState.isRotating;
      // when interaction with map ends, resets processingMapData state to show Loader component
      if ([isDragging, isZooming, isPanning, isRotating, inTransition].every(function (action) {
        return !action;
      })) {
        setProcessingMapData(true);
      }
      setInTransition(inTransition);
    },
    onBeforeRender: function onBeforeRender() {
      return setRender(true);
    },
    onAfterRender: function onAfterRender() {
      return setRender(false);
    },
    initialViewState: mapViewState,
    views: MAP_VIEW,
    layers: layers,
    controller: controller,
    onHover: finalOnHover,
    getTooltip: getTooltip,
    getCursor: getCursor,
    onClick: function onClick(info) {
      if (!(info !== null && info !== void 0 && info.object)) {
        setHighlightObj(null);
      }
      _onClick(info);
    },
    glOptions: {
      preserveDrawingBuffer: true // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
    }
  }, /*#__PURE__*/_react["default"].createElement(NavigationContainer, {
    position: navigationPosition
  }, /*#__PURE__*/_react["default"].createElement(_reactMapGl.NavigationControl, {
    showCompass: false
  })), /*#__PURE__*/_react["default"].createElement(_reactMapGl.StaticMap, {
    mapboxApiAccessToken: mapboxApiAccessToken,
    preserveDrawingBuffer: true
  })), legend, showTooltip && (hoverInfo === null || hoverInfo === void 0 ? void 0 : hoverInfo.object) && typeof renderTooltip === 'function' && renderTooltip({
    hoverInfo: hoverInfo,
    mapWidth: width,
    mapHeight: height
  }));
};
Map.propTypes = _objectSpread(_objectSpread({
  layers: _propTypes["default"].array,
  setDimensionsCb: _propTypes["default"].func,
  setHighlightObj: _propTypes["default"].func,
  getTooltip: _propTypes["default"].func,
  getCursor: _propTypes["default"].func,
  viewStateOverride: _propTypes["default"].object,
  legend: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].bool]),
  legendPosition: _propTypes["default"].string,
  showTooltip: _propTypes["default"].bool,
  renderTooltip: _propTypes["default"].func,
  initViewState: _propTypes["default"].object,
  pitch: _propTypes["default"].number,
  setZoom: _propTypes["default"].func,
  setCurrentViewport: _propTypes["default"].func,
  onHover: _propTypes["default"].func,
  onClick: _propTypes["default"].func,
  setProcessingMapData: _propTypes["default"].func,
  setInInteractiveState: _propTypes["default"].func,
  controller: _propTypes["default"].object
}, _reactMapGl.StaticMap.propTypes), _mapProps.commonProps);
Map.defaultProps = _objectSpread(_objectSpread({
  layers: [],
  setDimensionsCb: function setDimensionsCb() {},
  setHighlightObj: function setHighlightObj() {},
  getTooltip: function getTooltip() {},
  getCursor: function getCursor() {},
  viewStateOverride: {},
  legend: undefined,
  legendPosition: 'bottom-right',
  showTooltip: false,
  renderTooltip: undefined,
  pitch: 0,
  initViewState: undefined,
  setZoom: function setZoom() {},
  setCurrentViewport: function setCurrentViewport() {},
  controller: {
    controller: true
  },
  onHover: function onHover() {},
  onClick: function onClick() {},
  setProcessingMapData: function setProcessingMapData() {},
  setInInteractiveState: function setInInteractiveState() {}
}, _reactMapGl.StaticMap.defaultProps), _mapProps.commonDefaultProps);
var _default = Map;
exports["default"] = _default;