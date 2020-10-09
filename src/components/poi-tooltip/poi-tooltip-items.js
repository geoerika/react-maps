import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'


setup(React.createElement)

const Key = styled('p')`
  font-weight: bold;
  display: inline;
`

const Value = styled('span')``

const propTypes = { 
  tooltipKeys: PropTypes.array,
  params: PropTypes.object,
}
const defaultProps = { 
  tooltipKeys: [],
  params: {},
}

const POITooltipItems = ({ tooltipKeys, params }) => (
  <>
    { Object.entries(params).map(([key, value]) => (
      <div key={ key }>
        { tooltipKeys.includes(key) && (
          <div>
            <Key>{`${key}: `}</Key><Value>{value}</Value>
          </div>
        ) }
      </div>
    )) }
  </>
)

POITooltipItems.propTypes = propTypes
POITooltipItems.defaultProps = defaultProps

export default POITooltipItems
