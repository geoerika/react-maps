"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClientRect = exports.useRadius = exports.useFill = exports.useElevation = exports.useMapData = exports.useLegends = void 0;

var _react = require("react");

var _d3Color = require("d3-color");

var _constants = require("./constants");

var _legend = require("./utils/legend");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// TODO meaningful representation of elevation and radius based on given values
var useLegends = function useLegends(_ref) {
  var _ref$elevationBasedOn = _ref.elevationBasedOn,
      elevationBasedOn = _ref$elevationBasedOn === void 0 ? '' : _ref$elevationBasedOn,
      _ref$fillBasedOn = _ref.fillBasedOn,
      fillBasedOn = _ref$fillBasedOn === void 0 ? '' : _ref$fillBasedOn,
      fillColors = _ref.fillColors,
      _ref$objColor = _ref.objColor,
      objColor = _ref$objColor === void 0 ? '' : _ref$objColor,
      _ref$radiusBasedOn = _ref.radiusBasedOn,
      radiusBasedOn = _ref$radiusBasedOn === void 0 ? '' : _ref$radiusBasedOn,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$dataPropertyAcce = _ref.dataPropertyAccessor,
      dataPropertyAccessor = _ref$dataPropertyAcce === void 0 ? function (d) {
    return d;
  } : _ref$dataPropertyAcce,
      legendProps = _objectWithoutProperties(_ref, ["elevationBasedOn", "fillBasedOn", "fillColors", "objColor", "radiusBasedOn", "data", "dataPropertyAccessor"]);

  var legends = (0, _react.useMemo)(function () {
    return (0, _legend.setLegendConfigs)(_objectSpread({
      elevationBasedOn: elevationBasedOn,
      fillBasedOn: fillBasedOn,
      fillColors: fillColors,
      objColor: objColor,
      radiusBasedOn: radiusBasedOn,
      data: data,
      dataPropertyAccessor: dataPropertyAccessor
    }, legendProps));
  }, [elevationBasedOn, fillBasedOn, radiusBasedOn, fillColors, objColor, data, dataPropertyAccessor, legendProps]);
  return legends;
};

exports.useLegends = useLegends;

var useMapData = function useMapData(_ref2) {
  var _ref2$dataAccessor = _ref2.dataAccessor,
      dataAccessor = _ref2$dataAccessor === void 0 ? function (d) {
    return d;
  } : _ref2$dataAccessor,
      _ref2$dataPropertyAcc = _ref2.dataPropertyAccessor,
      dataPropertyAccessor = _ref2$dataPropertyAcc === void 0 ? function (d) {
    return d;
  } : _ref2$dataPropertyAcc,
      _ref2$keyTypes = _ref2.keyTypes,
      keyTypes = _ref2$keyTypes === void 0 ? ['number'] : _ref2$keyTypes,
      _ref2$excludeKeys = _ref2.excludeKeys,
      excludeKeys = _ref2$excludeKeys === void 0 ? ['lat', 'lon', 'poi_id', 'chain_id', 'report_id'] : _ref2$excludeKeys,
      _ref2$staticDataKeys = _ref2.staticDataKeys,
      staticDataKeys = _ref2$staticDataKeys === void 0 ? false : _ref2$staticDataKeys;

  // TODO use d3 to support multiple scales
  var _useReducer = (0, _react.useReducer)(function (state, _ref3) {
    var type = _ref3.type,
        payload = _ref3.payload;

    if (type === 'data') {
      var DATA_FIELDS = staticDataKeys || Object.entries(dataPropertyAccessor(dataAccessor(payload)[0])).filter(function (entry) {
        return keyTypes.includes(_typeof(entry[1])) && !excludeKeys.includes(entry[0]);
      }).map(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 1),
            k = _ref5[0];

        return k;
      }); // { [key]: { max, min }}
      // calculate all min and max

      var _metrics = dataAccessor(payload).reduce(function (agg, ele) {
        return _objectSpread({}, DATA_FIELDS.reduce(function (rowAgg, key) {
          return _objectSpread(_objectSpread({}, rowAgg), {}, _defineProperty({}, key, {
            max: Math.max((agg[key] || {
              max: null
            }).max, dataPropertyAccessor(ele)[key]),
            min: Math.min((agg[key] || {
              min: null
            }).min, dataPropertyAccessor(ele)[key])
          }));
        }, {}));
      }, {});

      return {
        data: payload,
        metrics: _metrics
      };
    }

    return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, type, payload));
  }, {
    data: [],
    metrics: {}
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      _useReducer2$ = _useReducer2[0],
      data = _useReducer2$.data,
      metrics = _useReducer2$.metrics,
      metricDispatch = _useReducer2[1];

  return {
    data: data,
    metrics: metrics,
    metricDispatch: metricDispatch
  };
};

exports.useMapData = useMapData;

var useElevation = function useElevation(_ref6) {
  var elevationBasedOnInit = _ref6.elevationBasedOnInit,
      getElevation = _ref6.getElevation,
      elevationDataScale = _ref6.elevationDataScale,
      elevations = _ref6.elevations,
      metrics = _ref6.metrics,
      _ref6$dataPropertyAcc = _ref6.dataPropertyAccessor,
      dataPropertyAccessor = _ref6$dataPropertyAcc === void 0 ? function (d) {
    return d;
  } : _ref6$dataPropertyAcc;

  var _useState = (0, _react.useState)(elevationBasedOnInit),
      _useState2 = _slicedToArray(_useState, 2),
      elevationBasedOn = _useState2[0],
      setElevationBasedOn = _useState2[1];

  (0, _react.useEffect)(function () {
    setElevationBasedOn(elevationBasedOnInit);
  }, [elevationBasedOnInit]);
  var finalGetElevation = (0, _react.useMemo)(function () {
    if (elevationBasedOn.length) {
      var d3Fn = _constants.SCALES[elevationDataScale]([(metrics[elevationBasedOn] || {
        min: 0
      }).min, (metrics[elevationBasedOn] || {
        max: 10
      }).max], elevations);

      return function (d) {
        return d3Fn(dataPropertyAccessor(d)[elevationBasedOn]);
      };
    }

    return getElevation;
  }, [elevationBasedOn, elevationDataScale, elevations, getElevation, metrics, dataPropertyAccessor]);
  return {
    elevationBasedOn: elevationBasedOn,
    finalGetElevation: finalGetElevation,
    setElevationBasedOn: setElevationBasedOn
  };
};

exports.useElevation = useElevation;

var useFill = function useFill(_ref7) {
  var fillBasedOnInit = _ref7.fillBasedOnInit,
      getFillColor = _ref7.getFillColor,
      fillDataScale = _ref7.fillDataScale,
      fillColors = _ref7.fillColors,
      metrics = _ref7.metrics,
      _ref7$dataPropertyAcc = _ref7.dataPropertyAccessor,
      dataPropertyAccessor = _ref7$dataPropertyAcc === void 0 ? function (d) {
    return d;
  } : _ref7$dataPropertyAcc;

  var _useState3 = (0, _react.useState)(fillBasedOnInit),
      _useState4 = _slicedToArray(_useState3, 2),
      fillBasedOn = _useState4[0],
      setFillBasedOn = _useState4[1];

  (0, _react.useEffect)(function () {
    setFillBasedOn(fillBasedOnInit);
  }, [fillBasedOnInit]);
  var finalGetFillColor = (0, _react.useMemo)(function () {
    if (fillBasedOn.length) {
      var d3Fn = _constants.SCALES[fillDataScale]([(metrics[fillBasedOn] || {
        min: 0
      }).min, (metrics[fillBasedOn] || {
        max: 10
      }).max], fillColors);

      return function (d) {
        var ret = (0, _d3Color.color)(d3Fn(dataPropertyAccessor(d)[fillBasedOn]));
        return [ret.r, ret.g, ret.b];
      };
    }

    return getFillColor;
  }, [fillBasedOn, fillDataScale, fillColors, getFillColor, metrics, dataPropertyAccessor]);
  return {
    fillBasedOn: fillBasedOn,
    finalGetFillColor: finalGetFillColor,
    setFillBasedOn: setFillBasedOn
  };
};

exports.useFill = useFill;

var useRadius = function useRadius(_ref8) {
  var radiusBasedOnInit = _ref8.radiusBasedOnInit,
      getRadius = _ref8.getRadius,
      radiusDataScale = _ref8.radiusDataScale,
      radii = _ref8.radii,
      metrics = _ref8.metrics,
      _ref8$dataPropertyAcc = _ref8.dataPropertyAccessor,
      dataPropertyAccessor = _ref8$dataPropertyAcc === void 0 ? function (d) {
    return d;
  } : _ref8$dataPropertyAcc;

  var _useState5 = (0, _react.useState)(radiusBasedOnInit),
      _useState6 = _slicedToArray(_useState5, 2),
      radiusBasedOn = _useState6[0],
      setRadiusBasedOn = _useState6[1];

  (0, _react.useEffect)(function () {
    setRadiusBasedOn(radiusBasedOnInit);
  }, [radiusBasedOnInit]);
  var finalGetRadius = (0, _react.useMemo)(function () {
    if (radiusBasedOn.length) {
      var d3Fn = _constants.SCALES[radiusDataScale]([(metrics[radiusBasedOn] || {
        min: 0
      }).min, (metrics[radiusBasedOn] || {
        max: 10
      }).max], radii);

      return function (d) {
        return d3Fn(dataPropertyAccessor(d)[radiusBasedOn]);
      };
    }

    return getRadius;
  }, [radiusBasedOn, radiusDataScale, radii, getRadius, metrics, dataPropertyAccessor]);
  return {
    finalGetRadius: finalGetRadius,
    setRadiusBasedOn: setRadiusBasedOn
  };
}; // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node


exports.useRadius = useRadius;

var useClientRect = function useClientRect() {
  var _useState7 = (0, _react.useState)({}),
      _useState8 = _slicedToArray(_useState7, 2),
      rect = _useState8[0],
      setRect = _useState8[1];

  var ref = (0, _react.useCallback)(function (node) {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
};

exports.useClientRect = useClientRect;