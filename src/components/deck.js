import React, { useState, useContext, useRef, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import IconClusterLayer from './layers/poi-cluster'
import { setPOIIcon } from './layers/poi-icon'

// import { AppContext } from '../context'

import PropTypes from 'prop-types'

// initial map view
const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 300,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5
}

/**
 * updateViewState - sets view port coordinates and passes them to a callback function
 * @param { element } deck - React DeckGL component
 * @param { boolean} flag - 
 * @returns { function } callback function which uses the new viewport coordinates
 */
const updateViewState = ({ deck }, flag = true) => (callback) => {
  if (flag) {
    const viewState = {
      ...deck.viewState,
      ...deck.viewState['default-view'],
      height: deck.height,
      width: deck.width,
    }
    const viewport = new WebMercatorViewport(viewState)
    const [w, n] = viewport.unproject([0, 0])
    const [e, s] = viewport.unproject([viewport.width, viewport.height])
    return callback({ w, n, e, s })
  }
}

// type of Deck.gl layers to use 
const LAYERS = {
  'icon': (data) => {
    return setPOIIcon(data)
  },
  'cluster': (data, onClick) => {
    return new IconClusterLayer({
      onClick,
      data,
      getSuperclusterRadius: (viewportZoom, sizeScale) => 
        viewportZoom > 15 ? sizeScale / 3 : sizeScale
    })
  },
}

/**
 * processLayers - choses a layer based on type parameter
 * @param { string } type - type of layer, ie: 'icon', 'cluster'
 * @param { array} data - poi data array
 * @param { function } onClick - click method to use
 * @returns { instanceOf } Deck.gl layer
 */
export const processLayers = (type, data, onClick) => {
  return LAYERS[type](data, onClick)
}

const propTypes = {
  poiData: PropTypes.array,
  layerType: PropTypes.string
}

const defaultProps = {
  poiData: [],
  layerType: ''
}  

// DeckGL React component
const DeckMap = ({ poiData, layerType}) => {

  const deckRef = useRef(null)

  const [layers, setLayers] = useState([])
  // const [clickedObject, setClickedObject] = useState(false)
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  const [viewport, setViewport] = useState({})
  const [activePOI, setActivePOI] = useState({})
  // const { isLightTheme, location } = useContext(AppContext)

  
  /**
   * setInitialView - sets initial view based on the set of poi data
   * @param { array } poiData - poi data array
   */
  const setInitialView = (poiData) => {
    // source: https://stackoverflow.com/questions/35586360/mapbox-gl-js-getbounds-fitbounds
    let lngArray = poiData.map((poi) => poi.geometry.coordinates[0])
    let latArray = poiData.map((poi) => poi.geometry.coordinates[1])

    const minCoords = [Math.min(...lngArray), Math.min(...latArray)];
    const maxCoords = [Math.max(...lngArray), Math.max(...latArray)];
    const formattedGeoData = [minCoords, maxCoords];

    const viewPort = new WebMercatorViewport(INIT_VIEW_STATE).fitBounds(formattedGeoData)
    const { latitude, longitude, zoom } = viewPort;

    setViewState({...INIT_VIEW_STATE, longitude, latitude, zoom })
  }
 
  /**
   * handleViewportChange - React Hook which updates viewport - sets its smallest orthogonal bounds 
   *                        that encompasses the visible region
   * @param { number } n - the upper (northern) y boundary value
   * @param { number } w - the left (western) x boundary value
   * @param { number } s - the lowest (southern) y boundary value
   * @param { number } e - the right (eastern) x boundary value
   */
  const handleViewportChange = useCallback(debounce(({ n, w, s, e }) => {
    setViewport({ xmin: w, xmax: e, ymin: s, ymax: n })
  }, 200), [])

  /**
   * onClick - handles zooming when clicking on clusters
   * @param { object } params - clicked icon or cluster
   */
  const onClick = (params) => { 
    const { object, layer, coordinate } = params
    const [ longitude, latitude ] = coordinate
    if (object.cluster) {
      setActivePOI({ longitude, latitude, zoom: layer.state.z + 2})
    }
  }
  
  useEffect(() => {
    if (poiData.length) { 
      setInitialView(poiData)
      setLayers([
        processLayers(layerType, poiData, onClick )  
      ])
    }
  }, [])

  useEffect(() => {
    setViewState(prevState => ({
      ...prevState,
      ...activePOI,
      onTransitionEnd: () => {
        updateViewState(deckRef.current)(handleViewportChange)
      }
    }))
  }, [layers, activePOI])
  
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <DeckGL
        ref={ deckRef }
        initialViewState={ viewState }
        layers={ layers }
        controller={ true }
        onDragEnd={() => { updateViewState(deckRef.current)(handleViewportChange) }}
        onViewStateChange={({ interactionState }) => {
          if (!interactionState.inTransition 
              && !interactionState.isDragging) {
            updateViewState(deckRef.current)(handleViewportChange)
          }
        }}
      > 
        <StaticMap 
          mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
          // mapStyle={ (isLightTheme || location) 
          //   ? 'mapbox://styles/mapbox/light-v9'
          //   : 'mapbox://styles/mapbox/dark-v9' 
          // }
        />
      </DeckGL>
    </div>
  )
}

DeckMap.propTypes = propTypes
DeckMap.defaultProps = defaultProps
export default DeckMap
