"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCursor = exports.createCircleFromPointRadius = exports.getDataRange = void 0;

var _d3Array = require("d3-array");

var _circle = _interopRequireDefault(require("@turf/circle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * getDataRange - returns array of min and max values of a data set
 * @param { object } param
 * @param { array } param.data - data array
 * @param { string } param.dataKey - data attribute key
 * @param { function } param.dataPropertyAccessor - function to access data attribute
 * @param { boolean } param.noZeroMin - value to indicate that we don't use 0 values for min
 * @return { array  } - array of min and max values
 */
var getDataRange = function getDataRange(_ref) {
  var data = _ref.data,
      dataKey = _ref.dataKey,
      dataPropertyAccessor = _ref.dataPropertyAccessor,
      noZeroMin = _ref.noZeroMin;

  if (data !== null && data !== void 0 && data.length) {
    var _extent = (0, _d3Array.extent)(data, function (d) {
      var _dataPropertyAccessor;

      return (_dataPropertyAccessor = dataPropertyAccessor(d)) === null || _dataPropertyAccessor === void 0 ? void 0 : _dataPropertyAccessor[dataKey];
    }),
        _extent2 = _slicedToArray(_extent, 2),
        min = _extent2[0],
        max = _extent2[1];

    if (min === max && max !== 0 && !noZeroMin) {
      var _ref2 = [Math.min(0, min), Math.max(0, max)];
      min = _ref2[0];
      max = _ref2[1];
    }

    return [min, max];
  }

  return [];
};
/**
 * createCircleFromPointRadius - creates a circle / polygon GeoJSON feature from a radius and a set
 *                               of coordinates
 * @param { object } param
 * @param { array } param.centre - array of coordinates for circle centroid [lon, lat]
 * @param { number } param.radius - radius value
 * @return { object } - GeoJSON object of created circle / polygon
 */


exports.getDataRange = getDataRange;

var createCircleFromPointRadius = function createCircleFromPointRadius(_ref3) {
  var centre = _ref3.centre,
      radius = _ref3.radius;
  // ToDo: research how large our radius can get and if can make a formula to set better step number
  var options = {
    steps: radius < 500 ? 50 : 100,
    units: 'meters'
  };
  var createdCircle = (0, _circle["default"])(centre, radius, options);
  createdCircle.properties.polygon_json = JSON.stringify(createdCircle.geometry);
  createdCircle.properties.poiType = 1;
  return createdCircle;
};
/**
 * getCursor - sets cursor for different layers and hover state
 * @param { object } params
 * @param { array } param.layers - current array of layers used in map
 * @return { function } - cursor function
 */


exports.createCircleFromPointRadius = createCircleFromPointRadius;

var getCursor = function getCursor() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      layers = _ref4.layers;

  if (layers !== null && layers !== void 0 && layers.length) {
    var _drawLayer$props;

    var drawLayer = layers.find(function (layer) {
      return layer.id === 'edit-draw layer' || layer.id.includes('select');
    });

    if (drawLayer !== null && drawLayer !== void 0 && (_drawLayer$props = drawLayer.props) !== null && _drawLayer$props !== void 0 && _drawLayer$props.visible) {
      return drawLayer.getCursor.bind(drawLayer);
    }
  }

  return function (_ref5) {
    var isDragging = _ref5.isDragging,
        isHovering = _ref5.isHovering;
    return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab';
  };
};

exports.getCursor = getCursor;