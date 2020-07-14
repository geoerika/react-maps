import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Map from './generic-map'


const propTypes = {
  getReport: PropTypes.func.isRequired,
  report_id: PropTypes.number.isRequired,
  layer_id: PropTypes.number.isRequired,
  map_id: PropTypes.number.isRequired,
}
const defaultProps = { layers: [] }

// DeckGL react component
const ReportWIMap = ({ getReport, report_id, layer_id, map_id }) => {
  const [layers, setLayers] = useState([])
  useEffect(() => {
    const getData = async () => {
      // TODO properly set layers!
      const reportData = await getReport({ report_id, layer_id, map_id })
      console.log('---> data!', reportData)
    }
    getData()
  }, [report_id, layer_id, map_id])
  return (
    <Map layers={layers} />
  )
}

ReportWIMap.propTypes = propTypes
ReportWIMap.defaultProps = defaultProps

export default ReportWIMap
