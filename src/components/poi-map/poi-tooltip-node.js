import React from 'react'
import PropTypes from 'prop-types'

import { tooltipPropTypes, tooltipDefaultProps } from '../../shared/map-props'
import { styled, setup } from 'goober'


setup(React.createElement)

const Key = styled('p')`
  font-weight: bold;
  display: inline;
`

const Value = styled('span')``

const propTypes = { 
  params: PropTypes.object,
}
const defaultProps = {
  params: {},
}

// POITooltipNode component - returns React element with "key: value" pairs for POITooltip 
const POITooltipNode = ({ tooltipKeys, params }) => (
  <>
    { Object.entries(params).map(([key, value]) => (
      <div key={ key }>
        { tooltipKeys.includes(key) && (
          <div>
            <Key>{`${key}: `}</Key>
            <Value>{ ['lon', 'lat'].includes(key) ? Math.round(value * 100) / 100 : value }</Value>
          </div>
        ) }
      </div>
    )) }
  </>
)

POITooltipNode.propTypes = { ...tooltipPropTypes, ...propTypes }
POITooltipNode.defaultProps = { ...tooltipDefaultProps, ...defaultProps }

export default POITooltipNode
