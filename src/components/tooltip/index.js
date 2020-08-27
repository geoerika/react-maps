import React, { useRef, forwardRef  } from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { useDimensions } from './hooks'


setup(React.createElement)

const tooltipPropTypes = {
  'max-height': PropTypes.number,
  'max-width': PropTypes.number
}

const Tooltip = styled('div')`
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

// const Tooltip = forwardRef((props, ref ) => 
//   styled('div')`
//     ref: ${ ref }
//     left: ${({ left }) => left}px;
//     top: ${({ top }) => top}px;
//     max-height: ${props['max-height']}px;
//     max-width: ${props['max-width']}px;
//     z-index: 9999;
//     position: absolute;
//     overflow: auto;
//     padding: 0em;
//     background-color: white;
//   `
// )

Tooltip.propTypes = tooltipPropTypes

// const TooltipDiv = forwardRef((props, ref) => 
//   <div
//     ref={ ref }
//     style= {{
//       left: `${({ left }) => left}px`,
//       top: `${({ top }) => top}px`,
//       maHeight: `${props['max-height']}px`,
//       maxWidth: `${props['max-width']}px`,
//       zIndex: 9999,
//       position: 'absolute',
//       overflow: 'auto',
//       padding: '0em',
//       backgroundColor: 'white'
//     }}
//   >
//   </div>
// )  

// const Tooltip = forwardRef((props, ref) =>
//   <TooltipDiv
//     ref={ ref }
//     props={props}
//   >
//   </TooltipDiv>
// )  

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