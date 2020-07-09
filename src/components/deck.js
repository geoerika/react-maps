import React, { useContext } from 'react'

import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { IconLayer } from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import { MapView } from 'deck.gl'

import IconClusterLayer from './layers/poi-cluster'
import poiIcon from './icons/poi-location.png'
import { AppContext } from '../context'

import iconMapping from './icons/cluster.json'
import eqIcon from './icons/cluster.png'

const MAP_VIEW = new MapView({repeat: true});

const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 300,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
}

const USER_ICON_MAPPING = { marker: { x: 0, y: 0, width: 1024, height: 1024 }}

let iconAtlas = eqIcon

// DeckGL react component
const DeckMap = ({ poiData, cluster = false }) => {

  const { isLightTheme, location } = useContext(AppContext)
  
  const layers = [
    cluster
      ? new IconClusterLayer({
        // highlight: false,
        data: poiData,
        pickable: true,
        getPosition: d => d.geometry.coordinates,
        iconAtlas,
        iconMapping,
        id: 'icon-cluster',
        sizeScale: 60,
        superclusterZoom: 20,
        getSuperclusterRadius: (viewportZoom, sizeScale) => viewportZoom > 15 ? sizeScale/3 : sizeScale
      })
      : new IconLayer({
        data: poiData,
        iconAtlas: poiIcon,
        iconMapping: USER_ICON_MAPPING,
        getIcon: d => 'marker',
        sizeScale: 5,
        getPosition: d => d.geometry.coordinates,
        getSize: d => 5,
        getColor: d => [255, 0, 0]
      })
  ]
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <DeckGL
        initialViewState={ INIT_VIEW_STATE } 
        views={ MAP_VIEW }
        layers={ [layers] }
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
