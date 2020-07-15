import React, { useState, useEffect, useCallback } from 'react'
import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import { processLayers, processOnClick } from '../shared/utils/index'

import PropTypes from 'prop-types'

import styled from 'styled-components'

const MapWrapper = styled.div`
  height: '100%';
  width: '100%';
  position: 'absolute';
`

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
  poiData,
  layerArray,
  onClickType,
  customOnClick
}) => {
<<<<<<< HEAD
=======

  console.log('Rendering...')
>>>>>>> Poi - refactor and clean up

  const [layers, setLayers] = useState([])
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  const [activePOI, setActivePOI] = useState({})

  /**
   * setInitialView - sets initial view based on the set of poi data
   * @param { array } poiData - poi data array
   */
  const setInitialView = (poiData) => {
    // source: https://stackoverflow.com/questions/35586360/mapbox-gl-js-getbounds-fitbounds
    const lngArray = poiData.map((poi) => poi.geometry.coordinates[0])
    const latArray = poiData.map((poi) => poi.geometry.coordinates[1])

    const minCoords = [Math.min(...lngArray), Math.min(...latArray)];
    const maxCoords = [Math.max(...lngArray), Math.max(...latArray)];
    const formattedGeoData = [minCoords, maxCoords];

    const viewPort = new WebMercatorViewport(INIT_VIEW_STATE).fitBounds(formattedGeoData)
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
    if (poiData.length) { 
      setInitialView(poiData)
      setLayers(processLayers(layerArray, poiData, onClick))
    }
  }, [onClick])

  // React Hook to handle updating view state
  useEffect(() => {
    setViewState(prevState => ({
      ...prevState,
      ...activePOI
    }))
  }, [layers, activePOI])
  
  return (
    <MapWrapper>
      <DeckGL
        initialViewState={ viewState }
        layers={ layers }
        controller={ true }
      > 
        <StaticMap 
          mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
        />
      </DeckGL>
    </MapWrapper>
  )
}

DeckMap.propTypes = propTypes
DeckMap.defaultProps = defaultProps
export default DeckMap
