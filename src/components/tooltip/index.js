import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import {
  typographyPropTypes,
  typographyDefaultProps,
  tooltipPropTypes,
  tooltipDefaultProps,
} from '../../shared/map-props'


setup(React.createElement)

const TooltipWrapper = styled('div')(({ info, typography, tooltipstyle }) => ({
  ...typography,
  ...tooltipstyle,
  position: 'absolute',
  zIndex: 1,
  pointerEvents: 'none',
  left: `calc(${info.x}px + 0.7rem)`,
  top: `calc(${info.y}px + 0.7rem)`,
}))

// Tooltip component - general tooltip for maps
const Tooltip = ({ info, children, typography, tooltipProps }) => {
  return (
    <TooltipWrapper
      info={info}
      typography={typography}
      tooltipstyle={tooltipProps}
    >
      {children}
    </TooltipWrapper>
  )
}

Tooltip.propTypes = {
  info: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  ...typographyPropTypes,
  ...tooltipPropTypes,
}

Tooltip.defaultProps = {
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
}

export default Tooltip
