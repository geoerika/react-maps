import React, { useState, useEffect, useCallback } from 'react'
import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import MapWrapper from './map-wrapper/index'

import { processLayers, processOnClick } from '../shared/utils/index'

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

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  poiData: PropTypes.array,
  layerArray: PropTypes.array,
  onClickType: PropTypes.string,
  customOnClick: PropTypes.func
}

const defaultProps = {
  poiData: [],
  layerArray: [],
  onClickType: '',
  customOnClick: () => {}
}

// DeckGL React component
const DeckMap = ({
  width,
  height,
  poiData,
  layerArray,
  onClickType,
  customOnClick
}) => {
  const [layers, setLayers] = useState([])
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  const [activePOI, setActivePOI] = useState({})

  // setInitialView - sets initial view based on the set of poi data
  const setInitialView = () => {
    // source: https://stackoverflow.com/questions/35586360/mapbox-gl-js-getbounds-fitbounds
    const lngArray = poiData.map((poi) => poi.geometry.coordinates[0])
    const latArray = poiData.map((poi) => poi.geometry.coordinates[1])

    const minCoords = [Math.min(...lngArray), Math.min(...latArray)];
    const maxCoords = [Math.max(...lngArray), Math.max(...latArray)];
    const formattedGeoData = [minCoords, maxCoords];
    const viewPort = new WebMercatorViewport({ width: width, height: height })
      .fitBounds(formattedGeoData, {padding: 100})
    const { latitude, longitude, zoom } = viewPort;

    setViewState({...INIT_VIEW_STATE, longitude, latitude, zoom })
  }

  /**
   * onClick - React hook that handles various in-house and custom onClick methods
   * @param { object } params - clicked icon or cluster
   */
  const onClick = useCallback(
    (params) => {
      if (onClickType) processOnClick(onClickType, params, setActivePOI)
      customOnClick(params)
    }, [],
  )
  
  // React Hook to handle setting up of initial view and layers
  useEffect(() => {
    if (poiData.length && (width || height)) { 
      setInitialView()
      setLayers(processLayers(layerArray, poiData, onClick))
    }
  }, [onClick, width, height])

  // React Hook to handle updating view state
  useEffect(() => {
    setViewState(prevState => ({
      ...prevState,
      ...activePOI
    }))
  }, [layers, activePOI])
  
  return (
    <DeckGL
      initialViewState={ viewState }
      layers={ layers }
      controller={ true }
    > 
      <StaticMap 
        mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
      />
    </DeckGL> 
  )
}

DeckMap.propTypes = propTypes
DeckMap.defaultProps = defaultProps
export default MapWrapper(DeckMap)
