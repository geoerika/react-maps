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
