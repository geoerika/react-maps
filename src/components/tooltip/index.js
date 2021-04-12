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

const propTypes = {
  info: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

const TooltipWrapper = styled('div')(({ info, typography, tooltipstyle }) => ({
  ...typography,
  ...tooltipstyle,
  position: 'absolute',
  zIndex: 1,
  pointerEvents: 'none',
  left: `calc(${info.x}px + 10px)`,
  top: `calc(${info.y}px + 10px)`,
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
  ...typographyPropTypes,
  ...tooltipPropTypes,
  ...propTypes,
}
Tooltip.defaultProps = {
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
}
export default Tooltip
