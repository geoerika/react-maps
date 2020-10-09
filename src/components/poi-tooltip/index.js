import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'
import POITooltipItems from './poi-tooltip-items'

setup(React.createElement)

const propTypes = {
  info: PropTypes.object,
  tooltipKeys: PropTypes.array,
}
const defaultProps = {
  info: {},
  tooltipKeys: []
} 

const TooltipWrapper = styled('div')`
  fontFamily: "Open Sans", sans-serif;
  color: black;
  backgroundColor: rgb(0, 181, 173, 0.8);
  fontSize: 12px;
  padding: 8px;
  position: absolute;
  zIndex: 1;
  pointerEvents: none;
  left: ${props => props.info.x}px;
  top: ${props => props.info.y}px;
`

/**
 * POITooltip - returns object with html and styling for tooltip element
 * @param { object } poi - point of interest object
 * @return { object } - tooltip object with html element and styling
 */
const POITooltip = ({ info, tooltipKeys }) => {
  const { object: { properties: params } = {} } = info

  return (
    <TooltipWrapper
      info={ info }
    >
      <POITooltipItems
        tooltipKeys={ tooltipKeys }
        params={ params }
      />
    </TooltipWrapper>
  )
}

POITooltip.propTypes = propTypes
POITooltip.defaultProps = defaultProps
export default POITooltip
