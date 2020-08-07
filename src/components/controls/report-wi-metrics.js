import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { days, hours } from '../../constants'
import { reportWI } from '../../datasets'


const ControlContainer = styled.div`
  flex-grow: 1;
  padding: 5px;
`

const propTypes = {
  selected: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
}

export const MetricSelector = ({
  selected,
  callback,
}) => (
  <ControlContainer>
    <select defaultValue={selected} onChange={e => callback(e.target.value)}>
      <option value=''>None</option>
      <option value='Sun'>Day of Week</option>
      <option value='0'>Hour of Day</option>
      {reportWI.DATA_FIELDS.map(key => <option key={key} value={key}>{key}</option>)}
    </select>
    {days.includes(selected) && (
      <>
        <label>Day:</label>
        <select defaultValue={selected} onChange={e => callback(e.target.value)}>
          {days.map(key => <option key={key} value={key}>{key}</option>)}
        </select>
      </>
    )}
    {hours.includes(selected) && (
      <>
        <label>Hour:</label>
        <select defaultValue={selected} onChange={e => callback(e.target.value)}>
          {hours.map(key => <option key={key} value={key}>{key}</option>)}
        </select>
      </>
    )}
  </ControlContainer>
)

MetricSelector.propTypes = propTypes

export default MetricSelector
