import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'


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
    fontFamily: 'Open Sans',
    fontSize: '0.75rem',
    textColor: 'rgb(0, 0, 0)',
  },
}

export const tooltipPropTypes = {
  tooltipProps: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    boxShadow: PropTypes.string.isRequired,
    borderRadius: PropTypes.string.isRequired,
    padding: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
  }),
}

export const tooltipDefaultProps = {
  tooltipProps: {
    backgroundColor: getTailwindConfigColor('secondary-50'),
    boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
    borderRadius: '0.25rem',
    padding: '0.625rem 0.75rem',
    opacity: 0.9,
  },  
}
