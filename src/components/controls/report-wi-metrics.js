import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { days, hours } from '../../constants'
import { reportWI } from '../../datasets'


setup(React.createElement)

const ControlContainer = styled('div')`
  flex-grow: 1;
  padding: 5px;
`

const propTypes = {
  selected: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  typeCallback: PropTypes.func.isRequired,
}

export const MetricSelector = ({
  selected,
  callback,
  type,
  typeCallback,
}) => (
  <ControlContainer>
    <select value={type} onChange={typeCallback}>
      <option value=''>None</option>
      <option value='metric'>Report Metric</option>
      <option value='dow'>Day of Week</option>
      <option value='hod'>Hour of Day</option>
    </select>
    {type === 'metric' && (
      <select value={selected} onChange={callback}>
        {reportWI.DATA_FIELDS.map(key => <option key={key} value={key}>{key}</option>)}
      </select>
    )}
    {type === 'dow' && (
      <select value={selected} onChange={callback}>
        {days.map(key => <option key={key} value={key}>{key}</option>)}
      </select>
    )}
    {type === 'hod' && (
      <select value={selected} onChange={callback}>
        {hours.map(key => <option key={key} value={key}>{key}</option>)}
      </select>
    )}
  </ControlContainer>
)

MetricSelector.propTypes = propTypes

export default MetricSelector
