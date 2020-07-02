import React, { useContext } from 'react'

import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { IconLayer} from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import { MapView } from 'deck.gl'
import userIcon from './icons/user-location.png'
import { AppContext } from '../context'

const MAP_VIEW = new MapView({repeat: true});

const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 300,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 54.602826,
  longitude: -100.257794,
  zoom: 3,
}

const USER_ICON_MAPPING = { marker: { x: 0, y: 0, width: 1024, height: 1024 }}

// DeckGL react component
const DeckMap = ({ poiData }) => {

  const { isLightTheme, location } = useContext(AppContext)
  const layers = [ 
    new IconLayer({
      data: poiData,
      iconAtlas: userIcon,
      iconMapping: USER_ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 5,
      getPosition: d => d.geometry.coordinates,
      getSize: d => 5,
      getColor: d => [255, 0, 0],
    })
  ]
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <DeckGL
        initialViewState={ INIT_VIEW_STATE } 
        views={ MAP_VIEW }
        layers={ layers }
        controller={ true }
      >
        <StaticMap 
          mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
          mapStyle={ (isLightTheme || location) 
            ? 'mapbox://styles/mapbox/light-v9'
            : 'mapbox://styles/mapbox/dark-v9' 
          }
        />
      </DeckGL>
    </div>
  )
}

export default DeckMap
