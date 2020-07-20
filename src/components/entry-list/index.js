import React from 'react'
import PropTypes from 'prop-types'


const propTypes = { object: PropTypes.object }
const defaultProps = { object: {} }

const EntryList = ({ object }) => (
  <div>
    {Object.entries(object).map(([key, value]) => (
      <div key={key}>{key}: {value}</div>
    ))}
  </div>
)

EntryList.propTypes = propTypes
EntryList.defaultProps = defaultProps

export default EntryList
