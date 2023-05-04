"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typographyPropTypes = exports.typographyDefaultProps = exports.tooltipPropTypes = exports.tooltipDefaultProps = exports.commonProps = exports.commonDefaultProps = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lumenLabs = require("@eqworks/lumen-labs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var commonProps = {
  mapboxApiAccessToken: _propTypes["default"].string.isRequired
};
exports.commonProps = commonProps;
var commonDefaultProps = {
  mapboxApiAccessToken: 'no-token'
};
exports.commonDefaultProps = commonDefaultProps;
var typographyPropTypes = {
  typography: _propTypes["default"].shape({
    fontFamily: _propTypes["default"].string.isRequired,
    fontSize: _propTypes["default"].string.isRequired,
    textColor: _propTypes["default"].string.isRequired
  })
};
exports.typographyPropTypes = typographyPropTypes;
var typographyDefaultProps = {
  typography: {
    fontFamily: 'Open Sans',
    fontSize: '0.75rem',
    textColor: 'rgb(0, 0, 0)'
  }
};
exports.typographyDefaultProps = typographyDefaultProps;
var tooltipPropTypes = {
  tooltipProps: _propTypes["default"].shape({
    backgroundColor: _propTypes["default"].string.isRequired,
    boxShadow: _propTypes["default"].string.isRequired,
    borderRadius: _propTypes["default"].string.isRequired,
    padding: _propTypes["default"].string.isRequired,
    opacity: _propTypes["default"].number.isRequired
  })
};
exports.tooltipPropTypes = tooltipPropTypes;
var tooltipDefaultProps = {
  tooltipProps: {
    backgroundColor: (0, _lumenLabs.getTailwindConfigColor)('secondary-50'),
    boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
    borderRadius: '0.25rem',
    padding: '0.625rem 0.75rem',
    opacity: 0.9
  }
};
exports.tooltipDefaultProps = tooltipDefaultProps;