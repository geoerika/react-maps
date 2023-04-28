"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFinalLayerDataProperty = void 0;

var _index = require("./index");

var _constants = require("../constants");

/**
 * setFinalLayerDataProperty - returns function or values to set deck.gl layer property (ex: fill colour, radius)
 * @param { object } param
 * @param { array } param.data - data array
 * @param { number || string || array || object } param.value - value for (attribute data || layer prop) or data attribute key
 * @param { number || string || array } param.defaultValue - default value attribute data || layer prop
 * @param { function } param.dataScale - D3 scale function
 * @param { array } param.valueOptions - array of range values for the deck.gl layer property
 * @param { function } param.dataPropertyAccessor - function to help access attribute data
 * @param { function } param.geometryAccessor - function to help access geometry keys
 * @param { string } param.mvtGeoKey - geometry key for mvt layer
 * @param { string } param.highlightId - id of selected object on the map
 * @param { object } param.keyAliases - object of pairs { key: alias } for data keys
 * @param { function } param.formatDataKey - function to format data key
 * @param { object } param.formatDataValue - object of { key: function } pairs to format values for individual data keys
 * @return { function || number || array  } - final function/number/array for deck.gl layer data accessor
 */
var setFinalLayerDataProperty = function setFinalLayerDataProperty(_ref) {
  var _data$tileData, _data$tileData2, _layerData, _value$field;

  var data = _ref.data,
      value = _ref.value,
      defaultValue = _ref.defaultValue,
      _ref$dataScale = _ref.dataScale,
      dataScale = _ref$dataScale === void 0 ? 'linear' : _ref$dataScale,
      valueOptions = _ref.valueOptions,
      _ref$dataPropertyAcce = _ref.dataPropertyAccessor,
      dataPropertyAccessor = _ref$dataPropertyAcce === void 0 ? function (d) {
    return d;
  } : _ref$dataPropertyAcce,
      _ref$geometryAccessor = _ref.geometryAccessor,
      geometryAccessor = _ref$geometryAccessor === void 0 ? function (d) {
    return d;
  } : _ref$geometryAccessor,
      mvtGeoKey = _ref.mvtGeoKey,
      _ref$highlightId = _ref.highlightId,
      highlightId = _ref$highlightId === void 0 ? null : _ref$highlightId,
      keyAliases = _ref.keyAliases,
      _ref$formatDataKey = _ref.formatDataKey,
      formatDataKey = _ref$formatDataKey === void 0 ? function (d) {
    return d;
  } : _ref$formatDataKey,
      _ref$formatDataValue = _ref.formatDataValue,
      formatDataValue = _ref$formatDataValue === void 0 ? {} : _ref$formatDataValue,
      noZeroMin = _ref.noZeroMin;

  if (!value && isNaN(value)) {
    return typeof defaultValue === 'function' ? defaultValue(highlightId) : defaultValue;
  } // case for text layer


  if (value.title) {
    return function (d) {
      return getLabel(d)({
        value: value,
        dataPropertyAccessor: dataPropertyAccessor,
        keyAliases: keyAliases,
        formatDataKey: formatDataKey,
        formatDataValue: formatDataValue
      });
    };
  } // case for radius for GeoJSON layer - there are no valueOptions for this layer


  if (value.field && !valueOptions && !(data !== null && data !== void 0 && (_data$tileData = data.tileData) !== null && _data$tileData !== void 0 && _data$tileData.length)) {
    return function (d) {
      var _dataPropertyAccessor;

      return (_dataPropertyAccessor = dataPropertyAccessor(d)) === null || _dataPropertyAccessor === void 0 ? void 0 : _dataPropertyAccessor[value.field];
    };
  }

  var layerData = data !== null && data !== void 0 && (_data$tileData2 = data.tileData) !== null && _data$tileData2 !== void 0 && _data$tileData2.length ? data.tileData : data;

  var setTileProp = function setTileProp(_ref2) {
    var propValue = _ref2.propValue,
        dataRange = _ref2.dataRange;
    layerData = Object.fromEntries(data.tileData.map(function (item) {
      var _dataPropertyAccessor2;

      return [geometryAccessor(item)[mvtGeoKey], {
        value: (_dataPropertyAccessor2 = dataPropertyAccessor(item)) === null || _dataPropertyAccessor2 === void 0 ? void 0 : _dataPropertyAccessor2[value.field]
      }];
    }));
    return function (_ref3) {
      var geo_id = _ref3.properties.geo_id;

      var _ref4 = layerData[geo_id] || {},
          value = _ref4.value;

      if (value || value === dataRange[0]) {
        return typeof propValue === 'function' ? propValue(value) : propValue;
      } // tiles with no data values will be transparent


      return [255, 255, 255, 0];
    };
  };

  if ((_layerData = layerData) !== null && _layerData !== void 0 && _layerData.length && (_value$field = value.field) !== null && _value$field !== void 0 && _value$field.length) {
    var _data$tileData4;

    var dataRange = (0, _index.getDataRange)({
      data: layerData,
      dataKey: value.field,
      dataPropertyAccessor: dataPropertyAccessor,
      noZeroMin: noZeroMin
    });

    if (valueOptions !== null && valueOptions !== void 0 && valueOptions.length) {
      var sample = dataPropertyAccessor(layerData[0]);

      if ((sample === null || sample === void 0 ? void 0 : sample[value.field]) === undefined) {
        return defaultValue;
      }

      if (dataRange[0] !== dataRange[1]) {
        var _data$tileData3;

        var scaleValues = valueOptions.length;
        var dataRangeValues = [dataRange[0]];

        if (scaleValues > 2) {
          var dataInterval = (dataRange[1] - dataRange[0]) / (scaleValues - 1);

          for (var i = 0; i < scaleValues - 2; i++) {
            dataRangeValues.push(dataInterval * (i + 1));
          }
        }

        dataRangeValues.push(dataRange[1]);
        console.log('dataRangeValues 2: ', dataRangeValues);

        var d3Fn = _constants.SCALES[dataScale](dataRangeValues, valueOptions);

        console.log('d3Fn: ', d3Fn); // case for MVT layer

        if (data !== null && data !== void 0 && (_data$tileData3 = data.tileData) !== null && _data$tileData3 !== void 0 && _data$tileData3.length) {
          return setTileProp({
            propValue: d3Fn,
            dataRange: dataRange
          });
        }

        return function (d) {
          var _dataPropertyAccessor3;

          return d3Fn((_dataPropertyAccessor3 = dataPropertyAccessor(d)) === null || _dataPropertyAccessor3 === void 0 ? void 0 : _dataPropertyAccessor3[value.field]);
        };
      }

      return noZeroMin && dataRange[0] ? valueOptions[1] : valueOptions[0];
    } // allow layer props with no data values and valueOptions, such as getLineWidth in MVT layers, to be set transparent


    if (data !== null && data !== void 0 && (_data$tileData4 = data.tileData) !== null && _data$tileData4 !== void 0 && _data$tileData4.length) {
      return setTileProp({
        propValue: value.customValue || defaultValue,
        dataRange: dataRange
      });
    }
  }

  return typeof value === 'function' ? value(highlightId) : value;
};
/**
 * getLabel - creates Text Layer label for each data point
 * @param { object } d - data element object
 * @param { object } param
 * @param { object } param.value - { title, valueKeys } object
 * @param { function } param.dataPropertyAccessor - function to access data properties
 * @param { object } param.keyAliases - object of pairs { key: alias } for data keys
 * @param { object } param.formatDataKey - function to format data key
 * @param { object } param.formatDataValue - object of { key: function } pairs
 * @returns { string } - string value of Label/Text for Text Layer
 */


exports.setFinalLayerDataProperty = setFinalLayerDataProperty;

var getLabel = function getLabel(d) {
  return function (_ref5) {
    var _value$valueKeys, _dataPropertyAccessor5;

    var value = _ref5.value,
        dataPropertyAccessor = _ref5.dataPropertyAccessor,
        keyAliases = _ref5.keyAliases,
        formatDataKey = _ref5.formatDataKey,
        formatDataValue = _ref5.formatDataValue;
    var labelValues = '';

    var labelKeyValue = function labelKeyValue(d) {
      return function (_ref6) {
        var _dataPropertyAccessor4;

        var valueKey = _ref6.valueKey;
        return (_dataPropertyAccessor4 = dataPropertyAccessor(d)) === null || _dataPropertyAccessor4 === void 0 ? void 0 : _dataPropertyAccessor4[valueKey];
      };
    };

    var getFormatLabelValue = function getFormatLabelValue(d) {
      return function (_ref7) {
        var valueKey = _ref7.valueKey,
            labelKeyValue = _ref7.labelKeyValue,
            formatDataValue = _ref7.formatDataValue;
        return formatDataValue[valueKey] ? formatDataValue[valueKey](labelKeyValue(d)({
          valueKey: valueKey
        })) : labelKeyValue(d)({
          valueKey: valueKey
        });
      };
    };

    var getLabelValue = function getLabelValue(_ref8) {
      var valueKey = _ref8.valueKey;
      return "\n".concat((keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[valueKey]) || formatDataKey(valueKey), ": ").concat(getFormatLabelValue(d)({
        valueKey: valueKey,
        labelKeyValue: labelKeyValue,
        formatDataValue: formatDataValue
      }));
    };

    labelValues = value === null || value === void 0 ? void 0 : (_value$valueKeys = value.valueKeys) === null || _value$valueKeys === void 0 ? void 0 : _value$valueKeys.reduce(function (acc, valueKey) {
      return acc + getLabelValue({
        valueKey: valueKey
      });
    }, '');
    return "".concat((keyAliases === null || keyAliases === void 0 ? void 0 : keyAliases[value.title]) || formatDataKey(value.title), ": ").concat((_dataPropertyAccessor5 = dataPropertyAccessor(d)) === null || _dataPropertyAccessor5 === void 0 ? void 0 : _dataPropertyAccessor5[value.title]).concat(labelValues.length ? labelValues : '');
  };
};