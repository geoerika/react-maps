"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLegendConfigs = exports.setLegendOpacity = void 0;

var _index = require("./index");

var _constants = require("../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * setLegendOpacity - adjusts legend opacity to match closer to deck.gl layer opacity
 * @param { object } param
 * @param { number } param.opacity - map opacity value
 * @returns { number  } - legend opacity value
 */
var setLegendOpacity = function setLegendOpacity(_ref) {
  var opacity = _ref.opacity;
  return opacity >= 1 ? 1 : opacity > 0.6 ? 0.9 : opacity + 0.2;
};
/**
* setLegendConfigs - set config objects for all legends of a map layer
* @param { object } param
* @param { string } param.elevationBasedOn - data attribute key for elevation
* @param { string } param.fillBasedOn - data attribute key for fill
* @param { string } param.radiusBasedOn - data attribute key for radius
* @param { string } param.arcWidthBasedOn - data attribute key for radius
* @param { array } param.fillColors - array of string or array colors
* @param { string } param.objColor - string format colour 'rgb(r, g, b, opacity)'
* @param { array } param.data - data array
* @param { function } param.dataPropertyAccessor - function to access data attribute values in the data objects
* @param { string } param.legendSize - legend size ('lg' or 'sm')
* @param { string } param.layerTitle - layer title
* @param { object } param.legendProps - various other legend props:
*               {keyAliases, formatLegendTitle, formatDataKey, formatDataValue, symbolLineColor}
* @returns { array  } - array of legend config objects
*/


exports.setLegendOpacity = setLegendOpacity;

var setLegendConfigs = function setLegendConfigs(_ref2) {
  var _ref2$elevationBasedO = _ref2.elevationBasedOn,
      elevationBasedOn = _ref2$elevationBasedO === void 0 ? '' : _ref2$elevationBasedO,
      _ref2$fillBasedOn = _ref2.fillBasedOn,
      fillBasedOn = _ref2$fillBasedOn === void 0 ? '' : _ref2$fillBasedOn,
      _ref2$radiusBasedOn = _ref2.radiusBasedOn,
      radiusBasedOn = _ref2$radiusBasedOn === void 0 ? '' : _ref2$radiusBasedOn,
      _ref2$arcWidthBasedOn = _ref2.arcWidthBasedOn,
      arcWidthBasedOn = _ref2$arcWidthBasedOn === void 0 ? '' : _ref2$arcWidthBasedOn,
      fillColors = _ref2.fillColors,
      _ref2$objColor = _ref2.objColor,
      objColor = _ref2$objColor === void 0 ? '' : _ref2$objColor,
      _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? [] : _ref2$data,
      _ref2$dataPropertyAcc = _ref2.dataPropertyAccessor,
      dataPropertyAccessor = _ref2$dataPropertyAcc === void 0 ? function (d) {
    return d;
  } : _ref2$dataPropertyAcc,
      _ref2$legendSize = _ref2.legendSize,
      legendSize = _ref2$legendSize === void 0 ? _constants.LEGEND_SIZE.large : _ref2$legendSize,
      layerTitle = _ref2.layerTitle,
      legendProps = _objectWithoutProperties(_ref2, ["elevationBasedOn", "fillBasedOn", "radiusBasedOn", "arcWidthBasedOn", "fillColors", "objColor", "data", "dataPropertyAccessor", "legendSize", "layerTitle"]);

  var minColor = objColor,
      maxColor = objColor;

  if (fillBasedOn || elevationBasedOn || arcWidthBasedOn) {
    if (Array.isArray(fillColors)) {
      minColor = fillColors === null || fillColors === void 0 ? void 0 : fillColors[0];
      maxColor = fillColors === null || fillColors === void 0 ? void 0 : fillColors[fillColors.length - 1];
    }

    if (typeof fillColors === 'string') {
      minColor = fillColors;
      maxColor = fillColors;
    }
  }

  var legends = [];

  if (fillBasedOn.length && data !== null && data !== void 0 && data.length) {
    // TODO support quantile/quantize
    // i.e. different lengths of fillColors[]
    var dataRange = (0, _index.getDataRange)({
      data: data,
      dataKey: fillBasedOn,
      dataPropertyAccessor: dataPropertyAccessor
    });
    legends.push(_objectSpread({
      layerTitle: layerTitle,
      minColor: minColor,
      maxColor: maxColor,
      fillColors: fillColors,
      type: _constants.LEGEND_TYPE.gradient,
      min: dataRange[0],
      max: dataRange[1],
      label: fillBasedOn
    }, legendProps));
  }

  if (elevationBasedOn.length && data !== null && data !== void 0 && data.length) {
    var _dataRange = (0, _index.getDataRange)({
      data: data,
      dataKey: elevationBasedOn,
      dataPropertyAccessor: dataPropertyAccessor
    });

    legends.push(_objectSpread({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      type: _constants.LEGEND_TYPE.elevation,
      minColor: minColor,
      maxColor: maxColor,
      fillColors: fillColors,
      min: _dataRange[0],
      max: _dataRange[1],
      label: elevationBasedOn
    }, legendProps));
  }

  if (radiusBasedOn.length && data !== null && data !== void 0 && data.length) {
    var _dataRange2 = (0, _index.getDataRange)({
      data: data,
      dataKey: radiusBasedOn,
      dataPropertyAccessor: dataPropertyAccessor
    });

    legends.push(_objectSpread({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      minColor: minColor,
      maxColor: maxColor,
      type: _constants.LEGEND_TYPE.size,
      // TO DO - use to customize legend symbol for radius/size
      dots: _constants.LEGEND_DOTS[legendSize],
      size: _constants.LEGEND_RADIUS_SIZE["default"],
      zeroRadiusSize: _constants.LEGEND_RADIUS_SIZE.zero,
      min: _dataRange2[0],
      max: _dataRange2[1],
      label: radiusBasedOn
    }, legendProps));
  }

  if (arcWidthBasedOn.length && data !== null && data !== void 0 && data.length) {
    var _dataRange3 = (0, _index.getDataRange)({
      data: data,
      dataKey: arcWidthBasedOn,
      dataPropertyAccessor: dataPropertyAccessor,
      noZeroMin: true
    });

    legends.push(_objectSpread({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      type: _constants.LEGEND_TYPE.lineWidth,
      minColor: minColor,
      maxColor: maxColor,
      min: _dataRange3[0],
      max: _dataRange3[1],
      label: arcWidthBasedOn
    }, legendProps));
  }

  if (layerTitle && layerTitle !== 'Arc Layer' && !(fillBasedOn.length || radiusBasedOn.length)) {
    legends.push({
      layerTitle: JSON.stringify(legends).includes(layerTitle) ? '' : layerTitle,
      type: _constants.LEGEND_TYPE.icon,
      maxColor: maxColor
    });
  }

  return legends;
};

exports.setLegendConfigs = setLegendConfigs;