import PropTypes from 'prop-types'

export const commonProps = {
  mapboxApiAccessToken: PropTypes.string.isRequired,
}

export const commonDefaultProps = {
  mapboxApiAccessToken:'no-token',
}

export const typographyPropTypes = {
  typography: PropTypes.shape({
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
  }),
}

export const typographyDefaultProps = {
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '12px',
    textColor: 'black',
  },
}

export const tooltipPropTypes = {
  tooltipKeys: PropTypes.PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    metricKeys: PropTypes.array,
    nameAccessor: PropTypes.func,
    idAccessor: PropTypes.func,
    metricAliases: PropTypes.object,
  }),
  tooltipProps: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    padding: PropTypes.string.isRequired,
  }),
}

export const tooltipDefaultProps = {
  tooltipKeys: {
    name: '',
    id: '',
    metricKeys: undefined,
    nameAccessor: d => d,
    idAccessor: d => d,
    metricAccessor: d => d,
    metricAliases: {},
  },
  tooltipProps: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #0062d9',
    borderRadius: '3px',
    padding: '8px',
  },  
}

export const POITooltipDefaultProps = {
  tooltipKeys: ['name', 'id', 'lat', 'lon'],
  tooltipProps: {
    backgroundColor: 'rgb(0, 181, 173, 0.7)',
    border: '1px solid rgb(0, 181, 173, 0.7)',
    borderRadius: '3px',
    padding: '8px',
  },  
}

export const POIMapProps = {
  mapProps: PropTypes.shape({
    fillColour: PropTypes.array.isRequired,
    polygonFillColour: PropTypes.array.isRequired,
    lineColour: PropTypes.array.isRequired,
    lineWidth: PropTypes.number.isRequired,
    opacity: PropTypes.number.isRequired,
  }),
}

export const POIMapDefaultProps = {
  mapProps: {
    fillColour: [239, 95, 102],
    polygonFillColour: [0,136,136],
    lineColour: [0, 0, 0],
    lineWidth: 2,
    opacity: 0.3,
  },
}
