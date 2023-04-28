"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataCoordinates = exports.setView = void 0;

var _core = require("@deck.gl/core");

var _index = require("./index");

var _constants = require("../constants");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @param { object } param
 * @param { array } param.data - data to display on the map
 * @param { number } param.width - deck container width
 * @param { number } param.height - deck container height
 * @return { object } { latitude, longitude, zoom } - lat, long, and zoom for new viewState
 */
var setView = function setView(_ref) {
  var _data$, _data$$geometry, _data$0$properties, _data$0$geometry, _data$0$properties2, _data$0$properties3;

  var data = _ref.data,
      width = _ref.width,
      height = _ref.height;
  var viewData = data; // for lists <100 radii, set viewport to fit radius for all POIs

  if (((_data$ = data[0]) === null || _data$ === void 0 ? void 0 : (_data$$geometry = _data$.geometry) === null || _data$$geometry === void 0 ? void 0 : _data$$geometry.type) === _constants.GEOJSON_TYPES.point && (data === null || data === void 0 ? void 0 : data.length) < 100) {
    viewData = [];
    data.forEach(function (point) {
      var _point$properties;

      if (point !== null && point !== void 0 && (_point$properties = point.properties) !== null && _point$properties !== void 0 && _point$properties.radius) {
        var pointCoord = point.geometry.coordinates;
        var pointRadius = point.properties.radius;
        viewData.push((0, _index.createCircleFromPointRadius)({
          centre: pointCoord,
          radius: pointRadius
        }));
      } else {
        // cover case for a POI without a radius
        viewData.push(point);
      }
    });
  }

  var formattedGeoData = getDataCoordinates({
    data: viewData
  });
  var dataLonDiff = formattedGeoData[0][0] - formattedGeoData[1][0];
  /**
   * -120 is the diff in longitude between the westernmost and easternmost points of
   * North America: (-172 - (-52)) = -120
   * Compare to the diff in longitude between westernmost point of NA and easternmost point of
   * Australia: -172 - (+153) = -325
   * Because we deal with a pitch, the distortion in map requires more padding between so extreme
   * points. We also need to reduce padding with map container shrinking size,
   * otherwise fitBounds breaks when padding is greater than map dimensions.
   */

  var padding = Math.min(width, height) / 4;

  if (dataLonDiff > -120) {
    padding = Math.min(width, height) / 10;
  } else if (Math.min(width, height) / 2 > 75) {
    padding = 75;
  } // set padding larger when we edit one radii POI


  if (data.length === 1 && !((_data$0$properties = data[0].properties) !== null && _data$0$properties !== void 0 && _data$0$properties.polygon)) {
    padding = Math.min(width, height) / 8;
  }

  var viewPort = new _core.WebMercatorViewport({
    width: width,
    height: height
  }).fitBounds(formattedGeoData, {
    padding: padding
  });
  var longitude = viewPort.longitude,
      latitude = viewPort.latitude,
      zoom = viewPort.zoom; // set a lower value zoom for a point with small or inexistent radius to have better map perspective

  if ((data === null || data === void 0 ? void 0 : data.length) === 1 && ((_data$0$geometry = data[0].geometry) === null || _data$0$geometry === void 0 ? void 0 : _data$0$geometry.type) === _constants.GEOJSON_TYPES.point && (!((_data$0$properties2 = data[0].properties) !== null && _data$0$properties2 !== void 0 && _data$0$properties2.radius) || ((_data$0$properties3 = data[0].properties) === null || _data$0$properties3 === void 0 ? void 0 : _data$0$properties3.radius) < 10)) {
    zoom = Math.min(zoom, 18);
  }

  return {
    longitude: longitude,
    latitude: latitude,
    zoom: zoom
  };
};
/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { object } param
 * @param { array } param.data - location data array
 * @returns { array } - coordinates that define the boundary area where the data is located
 */


exports.setView = setView;

var getDataCoordinates = function getDataCoordinates(_ref2) {
  var _data$2, _data$2$geometry;

  var data = _ref2.data;
  var coordinateArray;

  if ((_data$2 = data[0]) !== null && _data$2 !== void 0 && (_data$2$geometry = _data$2.geometry) !== null && _data$2$geometry !== void 0 && _data$2$geometry.type) {
    coordinateArray = data.reduce(function (acc, point) {
      var _point$geometry;

      var POIType = (_point$geometry = point.geometry) === null || _point$geometry === void 0 ? void 0 : _point$geometry.type;

      if (POIType === _constants.GEOJSON_TYPES.point) {
        return [].concat(_toConsumableArray(acc), [point.geometry.coordinates]);
      }

      if (POIType === _constants.GEOJSON_TYPES.polygon) {
        var _point$geometry$coord;

        return [].concat(_toConsumableArray(acc), _toConsumableArray((_point$geometry$coord = point.geometry.coordinates) === null || _point$geometry$coord === void 0 ? void 0 : _point$geometry$coord.flat()));
      }

      if (POIType === _constants.GEOJSON_TYPES.multipolygon) {
        var _point$geometry$coord2;

        return [].concat(_toConsumableArray(acc), _toConsumableArray((_point$geometry$coord2 = point.geometry.coordinates) === null || _point$geometry$coord2 === void 0 ? void 0 : _point$geometry$coord2.flat().flat()));
      }
    }, []);
  } else {
    coordinateArray = data.reduce(function (acc, point) {
      return [].concat(_toConsumableArray(acc), [[point === null || point === void 0 ? void 0 : point.lon, point === null || point === void 0 ? void 0 : point.lat]]);
    }, []);
  }

  var _coordinateArray$redu = coordinateArray.reduce(function (_ref3, point) {
    var _ref4 = _slicedToArray(_ref3, 2),
        _ref4$ = _slicedToArray(_ref4[0], 2),
        minLng = _ref4$[0],
        minLat = _ref4$[1],
        _ref4$2 = _slicedToArray(_ref4[1], 2),
        maxLng = _ref4$2[0],
        maxLat = _ref4$2[1];

    var _point = _slicedToArray(point, 2),
        lng = _point[0],
        lat = _point[1];

    return [[Math.min(minLng, lng), Math.min(minLat, lat)], [Math.max(maxLng, lng), Math.max(maxLat, lat)]];
  }, [[180, 90], [-180, -90]]),
      _coordinateArray$redu2 = _slicedToArray(_coordinateArray$redu, 2),
      minCoords = _coordinateArray$redu2[0],
      maxCoords = _coordinateArray$redu2[1];

  return [minCoords, maxCoords];
};

exports.getDataCoordinates = getDataCoordinates;