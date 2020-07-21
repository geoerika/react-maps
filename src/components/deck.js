import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import { getDataCoordinates } from '../shared/utils/index'

import styled from 'styled-components'

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: 'absolute';
`

import { processLayers } from '../shared/utils/index'

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
  onClickHandle: PropTypes.func
}

const defaultProps = {
  poiData: [],
  layerArray: [],
  onClickHandle: () => {}
}

// DeckGL React component
const DeckMap = ({
  poiData,
  layerArray,
  onClickHandle,
  ...mapProps
}) => {
  const [layers, setLayers] = useState([])
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  const [onClickPayload, setOnClickPayload] = useState({})
  const deckRef = useRef()

  // setInitialView - sets initial view based on the set of poi data
  const setInitialView = () => {
    const formattedGeoData = getDataCoordinates(poiData)
    const viewPort = new WebMercatorViewport({ width, height })
      .fitBounds(formattedGeoData, { padding: 100 })
    const { latitude, longitude, zoom } = viewPort

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
        setOnClickPayload({ longitude, latitude, zoom: layer.state.z + 2})
      } else onClickHandle(deckEvent, setOnClickPayload)
    }, []
  ) 

  const { width, height } = useMemo(() => {
    // initial rendering gives deckRef.current undefined
    return deckRef.current
      ? deckRef.current.deck
      : { width: 0, height: 0 }
  }, [deckRef.current]) 
  
  // React Hook to handle setting up of initial view and layers
  useLayoutEffect(() => {
    if (poiData.length && width && height) {
      setLayers(processLayers(layerArray, { ...mapProps, data: poiData, onClick }))
      setInitialView()
    }
  }, [onClick, width, height])

  // React Hook to handle updating view state
  useEffect(() => {
    setViewState(prevState => ({
      ...prevState,
      ...onClickPayload
    }))
  }, [layers, onClickPayload])
  
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
