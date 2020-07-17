import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import styled from 'styled-components'

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: 'absolute';
`

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
  const [layers, setLayers] = useState([])
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  const [clickCallback, setClickCallback] = useState({})

  let [width, height] = [0, 0]
  const deckRef = useRef()

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
    (deckEvent) => {
      const { object, layer, coordinate } = deckEvent
      const [ longitude, latitude ] = coordinate
      if (object.cluster) {
        setClickCallback({ longitude, latitude, zoom: layer.state.z + 2})
      } else onClickHandle(deckEvent, setClickCallback)
    }, []
  ) 

  if (deckRef.current) {
    [width, height] = [deckRef.current.deck.width, deckRef.current.deck.height]
  }  
  
  // React Hook to handle setting up of initial view and layers
  useLayoutEffect(() => {
    if (poiData.length && width && height) {
      setLayers(processLayers(layerArray, { ...mapProps, data: poiData, onClick: onClick }))
      setInitialView()
    }
  }, [onClick, deckRef.current])

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
        ref={ deckRef }
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
