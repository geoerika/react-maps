import React, { useState } from 'react'
import POIMap from './poi-map'
import PropTypes from 'prop-types'


const propTypes = {
  POIData: PropTypes.array,
}

const defaultProps = {
  POIData: [],
} 

const POIMapActivePOI = ({
  POIData
}) => {
  const [activePOI, setActivePOI] = useState({})

  const changeRadius = () => {
    let radius = 100
    let newActivePOI = {
      geometry: activePOI.geometry,
      properties: {
        ...activePOI.properties,
        radius
      }
    }
    setActivePOI(newActivePOI)
  }

  return (
    <div>
      <p>FIRST: select a POI on the map!</p>
      <button onClick={ changeRadius }>Change Radius</button>
      { POIData.length > 0 &&
        <POIMap
          POIData={ POIData }
          activePOI={ activePOI }
          setActivePOI={ setActivePOI }
          layerArray={ ['POIGeoJson', 'POIIcon'] }
        />
      } 
    </div>
  )
}

POIMapActivePOI.propTypes = propTypes
POIMapActivePOI.defaultProps = defaultProps
export default POIMapActivePOI
