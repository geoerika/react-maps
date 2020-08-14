import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { useDimensions } from './hooks'


const Tooltip = styled.div.attrs(props => ({
  style: {
    left: `${props.left}px`,
    top: `${props.top}px`,
    maxHeight: `${props.maxHeight}px`,
    maxWidth: `${props.maxWidth}px`,
  }
}))`
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
      maxHeight={Math.min(dimensions.h, h/2)}
      maxWidth={Math.min(dimensions.w, w/2)}
    >
      {children}
    </Tooltip>
  )
}

MapTooltipContainer.propTypes = propTypes
MapTooltipContainer.defaultProps = defaultProps

export default MapTooltipContainer