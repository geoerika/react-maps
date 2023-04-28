"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layers = require("@deck.gl/layers");

var _mapProps = require("../shared/map-props");

var _genericMap = _interopRequireDefault(require("./generic-map"));

var _legend = _interopRequireDefault(require("./legend"));

var _tooltip = _interopRequireDefault(require("./tooltip"));

var _tooltipNode = _interopRequireDefault(require("./tooltip/tooltip-node"));

var _utils = require("../utils");

var _layer = require("../utils/layer");

var _mapView = require("../utils/map-view");

var _color = require("../utils/color");

var _legend2 = require("../utils/legend");

var _hooks = require("../hooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var QLReportMap = function QLReportMap(_ref) {
  var reportData = _ref.reportData,
      getTooltip = _ref.getTooltip,
      onClick = _ref.onClick,
      onHover = _ref.onHover,
      getCursor = _ref.getCursor,
      opacity = _ref.opacity,
      radiusBasedOn = _ref.radiusBasedOn,
      radiusDataScale = _ref.radiusDataScale,
      radii = _ref.radii,
      getRadius = _ref.getRadius,
      getFillColor = _ref.getFillColor,
      fillBasedOn = _ref.fillBasedOn,
      fillDataScale = _ref.fillDataScale,
      fillColors = _ref.fillColors,
      getLineWidth = _ref.getLineWidth,
      getLineColor = _ref.getLineColor,
      showTooltip = _ref.showTooltip,
      tooltipProps = _ref.tooltipProps,
      tooltipNode = _ref.tooltipNode,
      tooltipKeys = _ref.tooltipKeys,
      typography = _ref.typography,
      showLegend = _ref.showLegend,
      legendPosition = _ref.legendPosition,
      legendNode = _ref.legendNode,
      dataPropertyAccessor = _ref.dataPropertyAccessor,
      formatLegendTitle = _ref.formatLegendTitle,
      formatTooltipTitle = _ref.formatTooltipTitle,
      formatTooltipTitleValue = _ref.formatTooltipTitleValue,
      formatDataKey = _ref.formatDataKey,
      formatDataValue = _ref.formatDataValue,
      keyAliases = _ref.keyAliases,
      mapboxApiAccessToken = _ref.mapboxApiAccessToken,
      scatterLayerProps = _objectWithoutProperties(_ref, ["reportData", "getTooltip", "onClick", "onHover", "getCursor", "opacity", "radiusBasedOn", "radiusDataScale", "radii", "getRadius", "getFillColor", "fillBasedOn", "fillDataScale", "fillColors", "getLineWidth", "getLineColor", "showTooltip", "tooltipProps", "tooltipNode", "tooltipKeys", "typography", "showLegend", "legendPosition", "legendNode", "dataPropertyAccessor", "formatLegendTitle", "formatTooltipTitle", "formatTooltipTitleValue", "formatDataKey", "formatDataValue", "keyAliases", "mapboxApiAccessToken"]);

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      viewStateOverride = _useState2[0],
      setViewOverride = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      highlightId = _useState4[0],
      setHighlightId = _useState4[1];

  var _useState5 = (0, _react.useState)({}),
      _useState6 = _slicedToArray(_useState5, 2),
      _useState6$ = _useState6[0],
      height = _useState6$.height,
      width = _useState6$.width,
      setDimensions = _useState6[1]; // limits viewport adjusting by data to one time only, the first time when map loads with data


  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      viewportAdjustedByData = _useState8[0],
      setViewportAdjustedByData = _useState8[1];

  (0, _react.useEffect)(function () {
    if (width && height && reportData !== null && reportData !== void 0 && reportData.length && !viewportAdjustedByData) {
      // recenter based on data
      var dataView = (0, _mapView.setView)({
        data: reportData,
        width: width,
        height: height
      });
      setViewOverride(function (o) {
        return _objectSpread(_objectSpread({}, o), dataView);
      });
      setViewportAdjustedByData(true);
    }
  }, [reportData, height, width, viewportAdjustedByData]);
  /**
   * finalOnClick - React hook that handles layer's onClick events
   * @param { object } param
   * @param { object } param.object - clicked object on the map
   */

  var finalOnClick = (0, _react.useCallback)(function (_ref2) {
    var object = _ref2.object;

    if (onClick) {
      onClick(object);
    } else if (object) {
      var lat = object.lat,
          lon = object.lon; // correct way to center map on clicked point; don't use 'coordinate' from onClick event

      var longitude = lon,
          latitude = lat;
      setHighlightId(object.poi_id);
      setViewOverride({
        longitude: longitude,
        latitude: latitude,
        zoom: 14
      });
    }
  }, [onClick]);
  /**
   * finalTooltipKeys - React hook that returns an object of keys for map's Tooltip component
   * @returns { Node } - object of keys { tooltipTitle1, tooltipTitle2, metricKeys }
   */

  var finalTooltipKeys = (0, _react.useMemo)(function () {
    var _ref3 = tooltipKeys || {},
        tooltipTitle1 = _ref3.tooltipTitle1,
        tooltipTitle2 = _ref3.tooltipTitle2,
        tooltipTitle1Accessor = _ref3.tooltipTitle1Accessor,
        tooltipTitle2Accessor = _ref3.tooltipTitle2Accessor,
        metricKeys = _ref3.metricKeys;

    var metricKeysArray = _toConsumableArray(metricKeys || []); // set metricKeys array if no custom keys are given


    if (showTooltip && !(metricKeys !== null && metricKeys !== void 0 && metricKeys.length)) {
      [radiusBasedOn, fillBasedOn].forEach(function (key) {
        if (key) {
          metricKeysArray.push(key);
        }
      });
    }

    return _objectSpread(_objectSpread({}, tooltipKeys), {}, {
      tooltipTitle1: tooltipTitle1 || '',
      tooltipTitle2: tooltipTitle2 || '',
      tooltipTitle1Accessor: tooltipTitle1Accessor || dataPropertyAccessor,
      tooltipTitle2Accessor: tooltipTitle2Accessor || dataPropertyAccessor,
      metricKeys: metricKeysArray
    });
  }, [showTooltip, tooltipKeys, radiusBasedOn, fillBasedOn, dataPropertyAccessor]);
  var layers = (0, _react.useMemo)(function () {
    var _reportData$;

    return [new _layers.ScatterplotLayer(_objectSpread({
      id: "".concat(((_reportData$ = reportData[0]) === null || _reportData$ === void 0 ? void 0 : _reportData$.report_id) || 'generic', "-report-scatterplot-layer"),
      data: reportData,
      getPosition: function getPosition(d) {
        return [d.lon, d.lat];
      },
      pickable: Boolean(onClick || onHover || getTooltip || getCursor),
      onClick: finalOnClick,
      opacity: opacity,
      getRadius: (0, _layer.setFinalLayerDataProperty)({
        data: reportData,
        value: radiusBasedOn ? {
          field: radiusBasedOn
        } : getRadius,
        defaultValue: getRadius,
        dataPropertyAccessor: dataPropertyAccessor,
        dataScale: radiusDataScale,
        valueOptions: radii
      }),
      getFillColor: (0, _layer.setFinalLayerDataProperty)({
        data: reportData,
        value: fillBasedOn ? {
          field: fillBasedOn
        } : getFillColor,
        defaultValue: getFillColor,
        dataPropertyAccessor: dataPropertyAccessor,
        dataScale: fillDataScale,
        // we need to convert string format color (used in legend) to array format color for deck.gl
        valueOptions: (0, _color.getArrayFillColors)({
          fillColors: fillColors
        }),
        highlightId: highlightId
      }),
      getLineWidth: getLineWidth,
      getLineColor: getLineColor,
      getTooltip: getTooltip,
      updateTriggers: {
        getRadius: [reportData, radiusBasedOn, dataPropertyAccessor, getRadius, radiusDataScale, radii],
        getFillColor: [reportData, fillBasedOn, dataPropertyAccessor, getFillColor, fillDataScale, fillColors, highlightId],
        getLineWidth: [getLineWidth],
        getLineColor: [getLineColor]
      }
    }, scatterLayerProps))];
  }, [reportData, highlightId, onClick, finalOnClick, onHover, getCursor, opacity, radiusBasedOn, radiusDataScale, radii, getRadius, fillBasedOn, getFillColor, fillDataScale, fillColors, getLineWidth, getLineColor, getTooltip, scatterLayerProps, dataPropertyAccessor]); // prepare list of legends with used parameteres

  var legends = (0, _hooks.useLegends)({
    radiusBasedOn: radiusBasedOn,
    fillBasedOn: fillBasedOn,

    /**
     * We convert an array of string format colors, into an array of rgba string format colours so we
     * can use them in the Legend Gradient component
     *
     * There is visually a difference between the legend opacity for color gradient and map opacity,
     * we need to adjust opacity for symbols in the legend to have a closer match
     */
    fillColors: (0, _color.getArrayGradientFillColors)({
      fillColors: fillColors,
      opacity: (0, _legend2.setLegendOpacity)({
        opacity: opacity
      })
    }),
    // convert array format color (used in deck.gl elevation fill) into str format color for legend
    objColor: (0, _color.arrayToRGBAStrColor)({
      color: getFillColor,
      opacity: (0, _legend2.setLegendOpacity)({
        opacity: opacity
      })
    }),
    data: reportData,
    dataPropertyAccessor: dataPropertyAccessor,
    keyAliases: keyAliases,
    formatLegendTitle: formatLegendTitle,
    formatDataKey: formatDataKey,
    formatDataValue: formatDataValue,
    symbolLineColor: typeof getLineColor !== 'function' ? (0, _color.arrayToRGBAStrColor)({
      color: getLineColor,
      opacity: (0, _legend2.setLegendOpacity)({
        opacity: opacity
      })
    }) : ''
  }); // set legend element

  var legend = (0, _react.useMemo)(function () {
    return showLegend && (legendNode || (legends === null || legends === void 0 ? void 0 : legends.length) > 0 && /*#__PURE__*/_react["default"].createElement(_legend["default"], {
      legends: legends,
      legendPosition: legendPosition,
      typograpy: typography
    }));
  }, [showLegend, legends, legendPosition, typography, legendNode]);
  return /*#__PURE__*/_react["default"].createElement(_genericMap["default"], {
    layers: layers,
    setDimensionsCb: function setDimensionsCb(o) {
      return setDimensions(o);
    },
    getTooltip: getTooltip,
    getCursor: getCursor({
      layers: layers
    }),
    onHover: onHover,
    viewStateOverride: viewStateOverride,
    showTooltip: showTooltip,
    renderTooltip: function renderTooltip(_ref4) {
      var hoverInfo = _ref4.hoverInfo,
          mapWidth = _ref4.mapWidth,
          mapHeight = _ref4.mapHeight;
      return /*#__PURE__*/_react["default"].createElement(_tooltip["default"], {
        info: hoverInfo,
        mapWidth: mapWidth,
        mapHeight: mapHeight,
        tooltipProps: tooltipProps,
        typography: typography
      }, tooltipNode({
        tooltipKeys: finalTooltipKeys,
        formatDataValue: formatDataValue,
        formatTooltipTitle: formatTooltipTitle,
        formatTooltipTitleValue: formatTooltipTitleValue,
        formatDataKey: formatDataKey,
        keyAliases: keyAliases,
        fontFamily: (typography === null || typography === void 0 ? void 0 : typography.fontFamily) || _mapProps.typographyDefaultProps.typography.fontFamily,
        params: hoverInfo.object
      }));
    },
    legend: legend,
    mapboxApiAccessToken: mapboxApiAccessToken
  });
};

QLReportMap.propTypes = _objectSpread(_objectSpread(_objectSpread({
  reportData: _propTypes["default"].array.isRequired,
  radiusBasedOn: _propTypes["default"].string,
  radiusDataScale: _propTypes["default"].string,
  radii: _propTypes["default"].array,
  getRadius: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].func]),
  radiusUnits: _propTypes["default"].string,
  filled: _propTypes["default"].bool,
  fillBasedOn: _propTypes["default"].string,
  fillDataScale: _propTypes["default"].string,
  fillColors: _propTypes["default"].array,
  getFillColor: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].array]),
  stroked: _propTypes["default"].bool,
  lineWidthUnits: _propTypes["default"].string,
  getLineWidth: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].func]),
  getLineColor: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].array]),
  opacity: _propTypes["default"].number,
  onClick: _propTypes["default"].func,
  onHover: _propTypes["default"].func,
  showLegend: _propTypes["default"].bool,
  legendPosition: _propTypes["default"].string,
  legendNode: _propTypes["default"].node,
  getTooltip: _propTypes["default"].func,
  showTooltip: _propTypes["default"].bool,
  tooltipNode: _propTypes["default"].func,
  getCursor: _propTypes["default"].func,
  dataPropertyAccessor: _propTypes["default"].func,
  pitch: _propTypes["default"].number,
  formatLegendTitle: _propTypes["default"].func,
  formatTooltipTitle: _propTypes["default"].func,
  formatDataKey: _propTypes["default"].func,
  formatData: _propTypes["default"].object,
  keyAliases: _propTypes["default"].object
}, _mapProps.commonProps), _mapProps.typographyPropTypes), _mapProps.tooltipPropTypes);
QLReportMap.defaultProps = _objectSpread(_objectSpread(_objectSpread({
  radiusBasedOn: '',
  radiusDataScale: 'linear',
  radii: [5, 50],
  getRadius: 10,
  radiusUnits: 'pixels',
  filled: true,
  // legend only works with string colour format, hex or rgba
  // for deck.gl layers we need to convert color strings in arrays of [r, g, b, a, o]
  fillBasedOn: '',
  fillDataScale: 'linear',
  fillColors: ['#bae0ff', '#0075ff'],
  //TO DO: make this more general, not specific to our data structure for reports
  getFillColor: function getFillColor(highlightId) {
    return function (d) {
      return (d === null || d === void 0 ? void 0 : d.poi_id) === highlightId ? [255, 138, 0] : [0, 117, 255];
    };
  },
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 1,
  getLineColor: [34, 66, 205],
  opacity: 0.5,
  onClick: undefined,
  onHover: undefined,
  showLegend: false,
  legendPosition: 'top-left',
  legendNode: undefined,
  getTooltip: undefined,
  showTooltip: false,
  tooltipNode: _tooltipNode["default"],
  getCursor: _utils.getCursor,
  dataPropertyAccessor: function dataPropertyAccessor(d) {
    return d;
  },
  formatLegendTitle: function formatLegendTitle(d) {
    return d;
  },
  formatTooltipTitle: function formatTooltipTitle(d) {
    return d;
  },
  formatDataKey: function formatDataKey(d) {
    return d;
  },
  formatDataValue: undefined,
  formatTooltipTitleValue: undefined,
  c: undefined
}, _mapProps.commonDefaultProps), _mapProps.typographyDefaultProps), _mapProps.tooltipDefaultProps);
var _default = QLReportMap;
exports["default"] = _default;