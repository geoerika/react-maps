import React, { useState } from 'react'
import POIMap from './poi-map'
import PropTypes from 'prop-types'


const propTypes = {
  poiData: PropTypes.array,
}

const defaultProps = {
  poiData: [],
} 

const POIMapActivePoi = ({
  poiData
}) => {
  const [activePoi, setActivePoi] = useState({})

  const changeRadius = () => {
    let radius = 100
    let newActivePoi = {
      geometry: activePoi.geometry,
      properties: {
        ...activePoi.properties,
        radius
      }
    }
    setActivePoi(newActivePoi)
  }

  return (
    <div>
      <p>FIRST: selelect a poi on the map!</p>
      <button type='button' onClick={ changeRadius }>Change Radius</button>
      { poiData.length > 0 &&
        <POIMap
          poiData={ poiData }
          activePoi={ activePoi }
          setActivePoi={ setActivePoi }
          layerArray={ ['geojson', 'icon'] }
        />
      } 
    </div>
  )
}

POIMapActivePoi.propTypes = propTypes
POIMapActivePoi.defaultProps = defaultProps
export default POIMapActivePoi
