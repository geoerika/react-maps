import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'
import POITooltipItems from './poi-tooltip-items'
import {
  typographyPropTypes,
  typographyDefaultProps,
  tooltipProps,
  tooltipDefaultProps,
} from '../../shared/map-props'

setup(React.createElement)

const propTypes = {
  info: PropTypes.object,
}
const defaultProps = {
  info: {},
} 

const TooltipWrapper = styled('div')(({ info, typography }) =>`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  color: ${typography.color};
  backgroundColor: rgb(0, 181, 173, 0.8);
  padding: 8px;
  position: absolute;
  zIndex: 1;
  pointerEvents: none;
  left: ${info.x}px;
  top: ${info.y}px;
`)

// POITooltip component - tooltip for POIMap
const POITooltip = ({ info, typography, tooltipKeys }) => {
  const { object: { properties: params } = {} } = info

  return (
    <TooltipWrapper
      info={ info }
      typography={ typography }
    >
      <POITooltipItems
        tooltipKeys={ tooltipKeys }
        params={ params }
      />
    </TooltipWrapper>
  )
}

POITooltip.propTypes = {
  ...typographyPropTypes,
  ...tooltipProps,
  ...propTypes,
}
POITooltip.defaultProps = {
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
  ...defaultProps,
}
export default POITooltip
