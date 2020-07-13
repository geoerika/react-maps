import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import Map from './generic-map'


const propTypes = { layers: PropTypes.array }
const defaultProps = { layers: [] }

// DeckGL react component
const ReportWIMap = ({ getReport }) => {
  const [layers, setLayers] = useState([])
  useEffect(() => {
    const getData = async () => {
      // TODO properly set layers!
      const reportData = await getReport()  
    }
    getData()
  }, [])
  return (
    <Map layers={layers} />
  )
}

ReportWIMap.propTypes = propTypes
ReportWIMap.defaultProps = defaultProps

export default ReportWIMap
