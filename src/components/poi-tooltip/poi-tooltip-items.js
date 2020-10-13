import React from 'react'
import PropTypes from 'prop-types'

import { tooltipProps, tooltipDefaultProps } from '../../shared/map-props'
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

// POITooltipItems component - returns React element with "key: value" pairs for POITooltip 
const POITooltipItems = ({ tooltipKeys, params }) => (
  <>
    { Object.entries(params).map(([key, value]) => (
      <div key={ key }>
        { tooltipKeys.includes(key) && (
          <div>
            <Key>{`${key}: `}</Key><Value>{ value }</Value>
          </div>
        ) }
      </div>
    )) }
  </>
)

POITooltipItems.propTypes = { ...tooltipProps, ...propTypes }
POITooltipItems.defaultProps = { ...tooltipDefaultProps, ...defaultProps }

export default POITooltipItems
