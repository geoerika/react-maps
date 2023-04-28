"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOLTIP_BUFFER = exports.CURSOR_BUFFER_X = exports.CURSOR_BUFFER = exports.FONT_SIZE = exports.GEOJSON_TYPES = exports.LEGEND_TEXT_GAP = exports.LEGEND_TITLE_BOTTOM_MARGIN = exports.LEGEND_LINE_HEIGHT = exports.MIN_LEGEND_LINE_WIDTH = exports.LEGEND_HEIGHT = exports.LEGEND_SYMBOL_WIDTH = exports.LEGEND_RADIUS_SIZE = exports.LEGEND_DOTS = exports.LEGEND_POSITION = exports.LEGEND_SIZE = exports.LEGEND_LAYER_MAX_WIDTH = exports.LEGEND_TYPE = exports.SUPERCLUSTER_ZOOM = exports.CLUSTER_SIZE_SCALE = exports.SCALES = exports.COLOURS = exports.TYPE_RADIUS = exports.TYPE_POLYGON = exports.days = exports.hours = exports.DATE_TYPES = void 0;

var _d3Scale = require("d3-scale");

var DATE_TYPES = {
  1: 'Daily',
  2: 'Weekly',
  3: 'Monthly'
};
exports.DATE_TYPES = DATE_TYPES;
var hours = new Array(24).fill(0).map(function (_, i) {
  return "".concat(i);
});
exports.hours = hours;
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
exports.days = days;
var TYPE_POLYGON = {
  code: 1,
  name: 'polygon',
  plural: 'polygons'
};
exports.TYPE_POLYGON = TYPE_POLYGON;
var TYPE_RADIUS = {
  code: 2,
  name: 'radius',
  plural: 'radii'
};
exports.TYPE_RADIUS = TYPE_RADIUS;
var COLOURS = ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'];
exports.COLOURS = COLOURS;
var SCALES = {
  'linear': _d3Scale.scaleLinear,
  'log': _d3Scale.scaleLog,
  'quantile': _d3Scale.scaleQuantile,
  'quantize': _d3Scale.scaleQuantize
};
exports.SCALES = SCALES;
var CLUSTER_SIZE_SCALE = 40;
exports.CLUSTER_SIZE_SCALE = CLUSTER_SIZE_SCALE;
var SUPERCLUSTER_ZOOM = 20;
exports.SUPERCLUSTER_ZOOM = SUPERCLUSTER_ZOOM;
var LEGEND_TYPE = {
  size: 'size',
  elevation: 'elevation',
  gradient: 'gradient',
  lineWidth: 'line width',
  icon: 'icon'
};
exports.LEGEND_TYPE = LEGEND_TYPE;
var LEGEND_LAYER_MAX_WIDTH = 10;
exports.LEGEND_LAYER_MAX_WIDTH = LEGEND_LAYER_MAX_WIDTH;
var LEGEND_SIZE = {
  small: 'sm',
  large: 'lg'
};
exports.LEGEND_SIZE = LEGEND_SIZE;
var LEGEND_POSITION = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
exports.LEGEND_POSITION = LEGEND_POSITION;
var LEGEND_DOTS = {
  sm: 4,
  lg: 5
};
exports.LEGEND_DOTS = LEGEND_DOTS;
var LEGEND_RADIUS_SIZE = {
  zero: 1.25,
  "default": 0.325
};
exports.LEGEND_RADIUS_SIZE = LEGEND_RADIUS_SIZE;
var LEGEND_SYMBOL_WIDTH = {
  zero: 1.25,
  sm: 5,
  lg: 7.5
};
exports.LEGEND_SYMBOL_WIDTH = LEGEND_SYMBOL_WIDTH;
var LEGEND_HEIGHT = {
  left: {
    sm: 1,
    lg: 1.325
  },
  right: {
    sm: 3.125,
    lg: 5.25
  }
};
exports.LEGEND_HEIGHT = LEGEND_HEIGHT;
var MIN_LEGEND_LINE_WIDTH = 2;
exports.MIN_LEGEND_LINE_WIDTH = MIN_LEGEND_LINE_WIDTH;
var LEGEND_LINE_HEIGHT = {
  min: .15,
  max: .4
};
exports.LEGEND_LINE_HEIGHT = LEGEND_LINE_HEIGHT;
var LEGEND_TITLE_BOTTOM_MARGIN = {
  "default": 0.4,
  lineWidth: 0.135
};
exports.LEGEND_TITLE_BOTTOM_MARGIN = LEGEND_TITLE_BOTTOM_MARGIN;
var LEGEND_TEXT_GAP = 0.5;
exports.LEGEND_TEXT_GAP = LEGEND_TEXT_GAP;
var GEOJSON_TYPES = {
  point: 'Point',
  polygon: 'Polygon',
  multipolygon: 'MultiPolygon'
};
exports.GEOJSON_TYPES = GEOJSON_TYPES;
var FONT_SIZE = getComputedStyle(document.documentElement).fontSize.slice(0, -2) || 16;
exports.FONT_SIZE = FONT_SIZE;
var CURSOR_BUFFER = 12;
exports.CURSOR_BUFFER = CURSOR_BUFFER;
var CURSOR_BUFFER_X = 5;
exports.CURSOR_BUFFER_X = CURSOR_BUFFER_X;
var TOOLTIP_BUFFER = 2.5;
exports.TOOLTIP_BUFFER = TOOLTIP_BUFFER;