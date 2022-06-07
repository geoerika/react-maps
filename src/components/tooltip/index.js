import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { getOffset, getPosition } from './utils'
import {
  typographyPropTypes,
  typographyDefaultProps,
  tooltipPropTypes,
  tooltipDefaultProps,
} from '../../shared/map-props'
import { CURSOR_BUFFER, CURSOR_BUFFER_X, TOOLTIP_BUFFER } from './../../constants'


setup(React.createElement)

const TooltipWrapper = styled('div')(({ left, top, typography, tooltipstyle }) => ({
  ...typography,
  ...tooltipstyle,
  position: 'absolute',
  zIndex: 1,
  pointerEvents: 'none',
  left,
  top,
  opacity: left && top ? tooltipstyle : 0,
}))

// Tooltip component - general tooltip for maps
const Tooltip = ({ info, children, typography, tooltipProps }) => {
  // get tooltip node dimensions
  const { width, height } = document.getElementById('tooltip')?.getBoundingClientRect() || {}

  // calculate left & top for tooltip position
  const { left, top } = useMemo(() => {
    const { width: mapWidth, height: mapHeight } = info?.viewport || {}
    let [left, top] = [0, 0]
    if (width && height) {
      const offsetX = getOffset({
        infoXY: info.x,
        mapWidthHeight: mapWidth,
        tooltipWidthHeight: width,
        offset1: CURSOR_BUFFER,
        offset2: CURSOR_BUFFER_X,
      })
      const offsetY = getOffset({
        infoXY: info.y,
        mapWidthHeight: mapHeight,
        tooltipWidthHeight: height,
        offset1: CURSOR_BUFFER + 2 * TOOLTIP_BUFFER,
        offset2: TOOLTIP_BUFFER,
      })
      left = getPosition({
        infoXY: info.x,
        tooltipWidthHeight: width,
        viewportWidthHeight: mapWidth,
        offset: offsetX,
      })
      top = getPosition({
        infoXY: info.y,
        tooltipWidthHeight: height,
        viewportWidthHeight: mapHeight,
        offset: offsetY,
      })
    }
    return { left, top }
  }, [info, height, width])

  return (
    <TooltipWrapper
      id='tooltip'
      tooltipstyle={tooltipProps}
      { ...{ info, left, top, typography }}
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
