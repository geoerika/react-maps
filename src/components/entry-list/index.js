import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'


setup(React.createElement)

const EntryListContainer = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const EntryListItem = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid black;
`

const Key = styled('div')`
  font-weight: bold;
`

const Value = styled('div')``

const propTypes = { object: PropTypes.object }
const defaultProps = { object: {} }

const EntryList = ({ object }) => (
  <EntryListContainer>
    {Object.entries(object).map(([key, value]) => (
      <EntryListItem key={key}>
        <Key>{key}:</Key><Value>{value ? value.toString() : value}</Value>
      </EntryListItem>
    ))}
  </EntryListContainer>
)

EntryList.propTypes = propTypes
EntryList.defaultProps = defaultProps

export default EntryList
