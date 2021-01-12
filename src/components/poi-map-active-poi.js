import React, { useState } from 'react'
import POIMap from './poi-map'
import PropTypes from 'prop-types'

import { commonProps } from '../shared/map-props'


const propTypes = {
  POIData: PropTypes.array,
}

const defaultProps = {
  POIData: [],
} 

const POIMapActivePOI = ({
  POIData,
  ...commonProps
}) => {
  const [activePOI, setActivePOI] = useState(null)

  const changeRadius = () => {
    let radius = 100
    let newActivePOI = {
      geometry: activePOI.geometry,
      properties: {
        ...activePOI.properties,
        radius,
      },
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
          mode='display'
          { ...commonProps }
        />
      } 
    </div>
  )
}

POIMapActivePOI.propTypes = { ...propTypes, ...commonProps }
POIMapActivePOI.defaultProps = defaultProps
export default POIMapActivePOI
