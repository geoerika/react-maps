"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _goober = require("goober");
var _constants = require("../../constants");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// import POIIconMarker from '../../shared/icons/poi-location.png'

(0, _goober.setup)(_react["default"].createElement);
var GradientContainer = (0, _goober.styled)('div')(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n"])));
var Gradient = (0, _goober.styled)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  height: ", ";\n  width: ", ";\n  margin: auto;\n  margin-top: ", ";\n  background-image: linear-gradient(", ");\n"])), function (_ref) {
  var height = _ref.height;
  return height ? "".concat(height, "rem") : '1rem';
}, function (_ref2) {
  var width = _ref2.width;
  return width ? "".concat(width, "rem") : '100%';
}, function (_ref3) {
  var margintop = _ref3.margintop;
  return margintop ? "".concat(margintop, "rem") : 'auto';
}, function (_ref4) {
  var mincolor = _ref4.mincolor,
    maxcolor = _ref4.maxcolor,
    fillColors = _ref4.fillColors;
  return fillColors ? "to right, ".concat(fillColors.join(', ')) : "to right, ".concat(mincolor, ", ").concat(maxcolor);
});
var Size = (0, _goober.styled)('div')(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: ", ";\n"])), function (_ref5) {
  var min = _ref5.min,
    max = _ref5.max;
  return min || max ? 'space-between' : 'center';
});
var Circle = (0, _goober.styled)('div')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  width: ", ";\n  height: ", ";\n  border: 0.065rem solid ", ";\n  border-radius: ", ";\n  background-color: ", ";\n  margin-top: ", ";\n"])), function (_ref6) {
  var size = _ref6.size;
  return "".concat(size, "rem");
}, function (_ref7) {
  var size = _ref7.size;
  return "".concat(size, "rem");
}, function (_ref8) {
  var linecolor = _ref8.linecolor;
  return linecolor;
}, function (_ref9) {
  var size = _ref9.size;
  return "".concat(size / 2, "rem");
}, function (_ref10) {
  var color = _ref10.color;
  return color;
}, function (_ref11) {
  var margintop = _ref11.margintop;
  return margintop ? "".concat(margintop, "rem") : '0rem';
});
var HeightWrapper = (0, _goober.styled)('div')(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  border-left: ", ";\n  border-right: ", ";\n  height: 1rem;\n  display: flex;\n  align-items: center;\n"])), function (_ref12) {
  var pos = _ref12.pos;
  return pos ? '0.065rem solid black' : '';
}, function (_ref13) {
  var pos = _ref13.pos;
  return pos ? '' : '0.065rem solid black';
});
var Height = (0, _goober.styled)('div')(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  width: ", "rem;\n  height: 0.5rem;\n  border-bottom: 0.065rem solid black;\n  border-top: 0.065rem solid black;\n  background-color: ", ";\n"])), function (_ref14) {
  var width = _ref14.width;
  return width;
}, function (_ref15) {
  var color = _ref15.color;
  return color;
});

// const Icon = styled('div')`
//   width: 1.5rem;
//   height: 1.5rem;
//   margin: auto;
//   margin-top: 0.625rem;
//   /* https://stackoverflow.com/questions/61370618/how-to-replace-color-of-png-image-using-css */
//   background: ${({ color }) => color};
//   -webkit-mask:url(${POIIconMarker}) center/contain;
//           mask:url(${POIIconMarker}) center/contain;
// `

var LegendSymbol = function LegendSymbol(_ref16) {
  var symbolProps = _ref16.symbolProps;
  var min = symbolProps.min,
    max = symbolProps.max,
    minColor = symbolProps.minColor,
    maxColor = symbolProps.maxColor,
    fillColors = symbolProps.fillColors,
    dots = symbolProps.dots,
    size = symbolProps.size,
    legendSize = symbolProps.legendSize,
    zeroRadiusSize = symbolProps.zeroRadiusSize,
    type = symbolProps.type,
    symbolLineColor = symbolProps.symbolLineColor;
  if (type === _constants.LEGEND_TYPE.elevation) {
    return /*#__PURE__*/_react["default"].createElement(Size, {
      min: min,
      max: max
    }, /*#__PURE__*/_react["default"].createElement(HeightWrapper, {
      pos: min !== max ? 'left' : 'center'
    }, /*#__PURE__*/_react["default"].createElement(Height, {
      width: _constants.LEGEND_HEIGHT.left[legendSize],
      color: !max && !min ? minColor : maxColor
    })), max !== min && /*#__PURE__*/_react["default"].createElement(HeightWrapper, null, /*#__PURE__*/_react["default"].createElement(Height, {
      width: _constants.LEGEND_HEIGHT.right[legendSize],
      color: maxColor
    })));
  }
  if (type === _constants.LEGEND_TYPE.gradient) {
    // console.log('fillColors: ', fillColors)
    // console.log(' JOIN: ',  fillColors.join(','))
    var _ref17 = max !== min ? [minColor, maxColor] : [minColor, minColor],
      _ref18 = _slicedToArray(_ref17, 2),
      minGradCol = _ref18[0],
      maxGradCol = _ref18[1];
    return (
      /*#__PURE__*/
      // we need to wrap Gradient into a <>, otherwise it might result in Legend disapearing from map
      _react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(Gradient, {
        mincolor: minGradCol,
        maxcolor: maxGradCol,
        fillColors: fillColors
      }))
    );
  }
  if (type === _constants.LEGEND_TYPE.size) {
    return /*#__PURE__*/_react["default"].createElement(Size, {
      min: min,
      max: max
    }, max !== min ? new Array(dots ? dots : _constants.LEGEND_DOTS[legendSize]).fill(0).map(function (_, i) {
      return /*#__PURE__*/_react["default"].createElement(Circle, {
        key: i,
        size: (i + 1.75) * size,
        color: maxColor,
        min: min,
        max: max,
        linecolor: symbolLineColor
      });
    }) : /*#__PURE__*/_react["default"].createElement(Circle, {
      size: zeroRadiusSize,
      color: max === 0 ? minColor : maxColor,
      max: max,
      linecolor: symbolLineColor,
      margintop: max === 0 ? minColor : 0.625
    }));
  }
  if (type === _constants.LEGEND_TYPE.lineWidth) {
    return /*#__PURE__*/_react["default"].createElement(GradientContainer, null, (min !== max || min === max && min === 0) && /*#__PURE__*/_react["default"].createElement(Gradient, {
      height: _constants.LEGEND_LINE_HEIGHT.min,
      margintop: .4,
      mincolor: minColor,
      maxcolor: maxColor
    }), (min || max || min === max && min !== 0) && /*#__PURE__*/_react["default"].createElement(Gradient, {
      height: _constants.LEGEND_LINE_HEIGHT.max,
      margintop: min === max ? 0 : .5,
      mincolor: minColor,
      maxcolor: maxColor
    }));
  }

  // if (type === LEGEND_TYPE.icon) {
  //   return (
  //     // we need to wrap Icon into a <>, otherwise it might result in Legend disapearing from map
  //     <>
  //       <Icon
  //         color={maxColor}
  //       />
  //     </>
  //   )
  // }
  // TODO: choropleth using import { scaleThreshold } from 'd3-scale'
  // potentially different methods of calculating domain, e.g. linear vs quartile
  /*
    export const COLOR_SCALE = scaleThreshold()
      .domain([-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
      .range([
        [65, 182, 196],
        [127, 205, 187],
        [199, 233, 180],
        [237, 248, 177],
        // zero
        [255, 255, 204],
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38]
      ]);
  */
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
};
LegendSymbol.propTypes = {
  symbolProps: _propTypes["default"].shape({
    type: _propTypes["default"].string,
    legendSize: _propTypes["default"].string.isRequired,
    fillBasedOn: _propTypes["default"].string,
    max: _propTypes["default"].number,
    min: _propTypes["default"].number,
    minColor: _propTypes["default"].string,
    maxColor: _propTypes["default"].string,
    fillColors: _propTypes["default"].arrayOf(_propTypes["default"].string),
    dots: _propTypes["default"].number,
    size: _propTypes["default"].number,
    zeroRadiusSize: _propTypes["default"].number,
    symbolLineColor: _propTypes["default"].string
  }).isRequired
};
LegendSymbol.defaultProps = {
  symbolProps: {
    type: 'gradient',
    fillBasedOn: '',
    max: undefined,
    min: undefined,
    fillColors: undefined,
    minColor: 'rgb(0,0,0)',
    maxColor: 'rgb(255,0,0)',
    dots: _constants.LEGEND_DOTS.lg,
    size: _constants.LEGEND_RADIUS_SIZE["default"],
    zeroRadiusSize: _constants.LEGEND_RADIUS_SIZE.zero,
    symbolLineColor: 'rgb(0,0,0)'
  }
};
var _default = LegendSymbol;
exports["default"] = _default;