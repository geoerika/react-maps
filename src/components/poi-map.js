import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import { getDataCoordinates, processLayers } from '../shared/utils'

import styled from 'styled-components'
import PropTypes from 'prop-types'

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
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
  onClickHandle: PropTypes.func,
  mode: PropTypes.string,
  controller: PropTypes.object,
}

const defaultProps = {
  poiData: [],
  layerArray: [],
  onClickHandle: () => {},
  mode: null,
  controller: { controller: true }
}

// DeckGL React component
const POIMap = ({
  poiData,
  layerArray,
  onClickHandle,
  mode,
  controller,
  ...mapProps
}) => {
  const [ data, setData ] = useState(poiData)
  const [ layers, setLayers ] = useState([])
  const [ viewState, setViewState ] = useState(INIT_VIEW_STATE)
  const [ onClickPayload, setOnClickPayload ] = useState({})
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
    }, [onClickHandle]
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
      setInitialView()
    }
  }, [poiData, onClick, width, height])

  // React Hook to handle updating view state
  useEffect(() => {
    setViewState(prevState => ({
      ...prevState,
      ...onClickPayload
    }))
    setLayers(processLayers(layerArray, { ...mapProps, data, setData, mode, onClick }))
  }, [mode, data, layers.length, onClickPayload])

  let getCursor = ({isGrabbing}) => isGrabbing ? 'grabbing' : 'grab'
  //set cursor for drawing mode (nebula layer)
  if (layers.length > 0) {
    let indexDrawLayer = layers.findIndex(layer => layer.id === 'draw layer')
    if (indexDrawLayer >= 0)
      getCursor = layers[indexDrawLayer].getCursor.bind(layers[indexDrawLayer])
  }

  return (
    <MapWrapper>
      <DeckGL
        ref={ deckRef }
        initialViewState={ viewState }
        layers={ layers }
        getCursor={ getCursor }
        controller={ controller }
      > 
        <StaticMap 
          mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
        />
      </DeckGL>
    </MapWrapper>
  )
}

POIMap.propTypes = propTypes
POIMap.defaultProps = defaultProps
export default POIMap
