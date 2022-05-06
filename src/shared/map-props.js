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
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '12px',
    textColor: 'black',
  },
}

export const tooltipPropTypes = {
  tooltipKeys: PropTypes.oneOfType([
    PropTypes.PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      metricKeys: PropTypes.array,
      nameAccessor: PropTypes.func,
      idAccessor: PropTypes.func,
      metricAliases: PropTypes.object,
    }),
    PropTypes.array,
  ]),
  tooltipProps: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    boxShadow: PropTypes.string.isRequired,
    borderRadius: PropTypes.string.isRequired,
    padding: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
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
    backgroundColor: getTailwindConfigColor('secondary-50'),
    boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
    borderRadius: '0.15rem',
    padding: '0.5rem',
    opacity: 0.9,
  },  
}
