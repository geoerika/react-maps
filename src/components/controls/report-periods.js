import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { DATE_TYPES } from '../../constants'


setup(React.createElement)

const ControlContainer = styled('div')`
  flex-grow: 1;
  padding: 5px;
`

const propTypes = {
  selectPeriod: PropTypes.func.isRequired,
  selectPeriodType: PropTypes.func.isRequired,
  periods: PropTypes.array,
  selected: PropTypes.object,
}

const defaultProps = { periods: [], selected: {} }

const formatDate = d => `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`

export const PeriodSelector = ({
  selectPeriod,
  selectPeriodType,
  selected,
  periods,
}) => (
  <ControlContainer>
    {periods.length ? (
      <>
        <label>Report Period</label>
        <select value={selected.date_type} onChange={e => selectPeriodType(e.target.value)}>
          {Object.entries(DATE_TYPES).map(([key, text]) => (
            <option key={key} value={key}>{text}</option>
          ))}
        </select>
        <select value={selected.key} onChange={e => selectPeriod(periods.find(o => o.key === e.target.value))}>
          {periods.map(({ key, start_date, end_date }) => (
            <option key={key} value={key}>
              {formatDate(new Date(start_date))} - {formatDate(new Date(end_date))}
            </option>
          ))}
        </select>
      </>) : (<p>No Report Data</p>)}
  </ControlContainer>
)

PeriodSelector.propTypes = propTypes
PeriodSelector.defaultProps = defaultProps

export default PeriodSelector
