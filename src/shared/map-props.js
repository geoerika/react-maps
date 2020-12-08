import PropTypes from 'prop-types'

export const typographyPropTypes = {
  typography: PropTypes.shape({
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    textColor: PropTypes.string.isRequired,
  }),
}

export const typographyDefaultProps = {
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 12,
    textColor: 'black',
  },
}

export const tooltipProps = {
  tooltipKeys: PropTypes.array,
}  

export const tooltipDefaultProps = {
  tooltipKeys: ['name', 'id', 'lat', 'lon'],
}

export const POIMapProps = {
  mapProps: PropTypes.shape({
    fillColour: PropTypes.array.isRequired,
    polygonFillColour: PropTypes.array.isRequired,
    lineColour: PropTypes.array.isRequired,
    lineWidth: PropTypes.number.isRequired,
    opacity: PropTypes.number.isRequired,
  })
}

export const POIMapDefaultProps = {
  mapProps: {
    fillColour: [239, 95, 102],
    polygonFillColour: [0,136,136],
    lineColour: [0, 0, 0],
    lineWidth: 2,
    opacity: 0.3,
  }
}
