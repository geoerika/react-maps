import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { DATE_TYPES } from '../../constants'


const ControlContainer = styled.div`
  flex-grow: 1;
  padding: 5px;
`

const propTypes = {
  callback: PropTypes.func.isRequired,
  periods: PropTypes.array,
  selected: PropTypes.object,
}

const defaultProps = { periods: [], selected: {} }

const formatDate = d => `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`

export const PeriodSelector = ({
  callback,
  selected,
  periods,
}) => {
  const [dateType, setDateType] = useState(selected.date_type)
  useEffect(() => {
    if (!dateType) {
      setDateType(selected.date_type)
    }
  }, [dateType, selected])
  console.log('----> PERIOD SELECTOR', selected, dateType, periods)
  return (
    <ControlContainer>
      {periods.length ? (
        <>
          <label>Type</label>
          <select defaultValue={dateType} onChange={e => setDateType(e.target.value)}>
            {Object.entries(DATE_TYPES).map(([key, text]) => (
              <option key={key} value={key}>{text}</option>
            ))}
          </select>
          <select defaultValue={selected.key} onChange={e => callback(periods.find(o => o.key === e.target.value))}>
            {periods.filter(({ date_type }) => dateType == date_type)
              .map(({ key, start_date, end_date }) => <option key={key} value={key}>{formatDate(new Date(start_date))} - {formatDate(new Date(end_date))}</option>)}
          </select>
        </>) : (<p>No Report Data</p>)}
    </ControlContainer>
  )
}

PeriodSelector.propTypes = propTypes
PeriodSelector.defaultProps = defaultProps

export default PeriodSelector
