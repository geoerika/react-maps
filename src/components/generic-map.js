import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import DeckGL, { FlyToInterpolator, MapView } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import { AppContext } from '../context'


const MAP_VIEW = new MapView({ repeat: true });

const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 300,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
}

const propTypes = { layers: PropTypes.array }
const defaultProps = { layers: [] }

// DeckGL react component
const Map = ({ layers }) => {

  const { isLightTheme } = useContext(AppContext)
  
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <DeckGL
        initialViewState={ INIT_VIEW_STATE } 
        views={ MAP_VIEW }
        layers={layers}
        controller={ true }
        // NOTE: same structure as layer click
        // onHover={d => console.log('----> map hover', d)}
        // onClick={d => console.log('----> map click', d)}
      >
        <StaticMap 
          mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
          mapStyle={`mapbox://styles/mapbox/${isLightTheme ? 'light' : 'dark'}-v9`}
        />
      </DeckGL>
    </div>
  )
}

Map.propTypes = propTypes
Map.defaultProps = defaultProps

export default Map
