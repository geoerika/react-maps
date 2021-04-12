import React, { useRef, forwardRef  } from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { useDimensions } from './hooks'


setup(React.createElement)

const Tooltip = styled('div', forwardRef)`
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  max-height: ${props => props['max-height']}px;
  max-width: ${props => props['max-width']}px;
  z-index: 9999;
  position: absolute;
  overflow: auto;
  padding: 0em;
  background-color: white;
`

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  translate: PropTypes.bool,
  classes: PropTypes.string,
}

const defaultProps = {
  translate: false,
  classes: '',
}

const MapTooltipContainer = ({
  x,
  y,
  w,
  h,
  children,
  translate,
  classes,
}) => {
  // TODO anchor position configuration, currently just bottom right
  const tooltipRef = useRef()
  const dimensions = useDimensions(tooltipRef, w, h)
  const xOffset = Math.max(-dimensions.w, w - (x + dimensions.w))
  const yOffset = Math.max(-dimensions.h, h - (y + dimensions.h))

  return (
    <Tooltip
      ref={tooltipRef}
      className={classes}
      left={x + ((!translate || xOffset > 0) ? 0 : xOffset)}
      top={y + ((!translate || yOffset > 0) ? 0 : yOffset)}
      max-height={Math.min(dimensions.h, h/2)}
      max-width={Math.min(dimensions.w, w/2)}
    >
      {children}
    </Tooltip>
  )
}

MapTooltipContainer.propTypes = propTypes
MapTooltipContainer.defaultProps = defaultProps

export default MapTooltipContainer
