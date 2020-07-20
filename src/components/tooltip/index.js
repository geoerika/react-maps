import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { useDimensions } from './hooks'


const Tooltip = styled.div`
  z-index: 1000;
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  max-height: ${props => props.maxHeight}px;
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
  const tooltipRef = useRef(false)
  const dimensions = useDimensions(tooltipRef, w, h)
  const xOffset = w - (x + dimensions.w)
  const yOffset = h - (y + dimensions.h)
  return (
    <Tooltip
      ref={tooltipRef}
      className={classes}
      left={x + ((!translate || xOffset > 0) ? 0 : xOffset)}
      top={y + ((!translate || yOffset > 0) ? 0 : yOffset)}
      maxHeight={h/2}
    >
      {children}
    </Tooltip>
  )
}

MapTooltipContainer.propTypes = propTypes
MapTooltipContainer.defaultProps = defaultProps

export default MapTooltipContainer