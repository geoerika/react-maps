import React, { 
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  useReducer,
} from 'react'
import PropTypes from 'prop-types'

import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import { styled, setup } from 'goober'

import { processLayers, setView, getCursor } from '../shared/utils'
import { useRefDimensions } from '../hooks'


setup(React.createElement)

const MapWrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
`

// initial map view
const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 3000,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
  minZoom: 0,
  maxZoom: 15,
}

// initial map view for drawing mode
const INIT_VIEW_DRAW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 300,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 43.661539,
  longitude: -79.361079,
  zoom: 4,
}

const propTypes = {
  poiData: PropTypes.array,
  layerArray: PropTypes.array,
  onClickHandle: PropTypes.func,
  mode: PropTypes.string,
  controller: PropTypes.object,
  mapProps: PropTypes.object,
}

const defaultProps = {
  poiData: [],
  layerArray: [],
  onClickHandle: () => {},
  mode: '',
  controller: { controller: true },
  mapProps: {},
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
  const [data, setData] = useState([])
  const [onClickPayload, setOnClickPayload] = useState({})
  const deckRef = useRef()
  const { width, height } = useRefDimensions(deckRef)

  /**
   * onClick - React hook that handles various in-house and custom onClick methods
   * @param { object } deckEvent - current deck properties
   */
  const onClick = useCallback(
    (deckEvent) => {
      const { object, layer, coordinate } = deckEvent
      const [longitude, latitude] = coordinate
      if (object.cluster) {
        setOnClickPayload({ longitude, latitude, zoom: layer.state.z + 2 })
      } else onClickHandle(deckEvent, setOnClickPayload)
    }, [onClickHandle]
  )

  // set layers for deck map
  const layers = useMemo(() =>
    processLayers(layerArray, { ...mapProps, data, setData, onClick, mode})
  , [layerArray, mapProps, data, setData, onClick, mode])

  // state viewState
  const [{ viewState }, viewStateDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'data view') {
      return {
        viewState: {
          ...state.viewState,
          ...setView(payload),
        }
      }  
    }
    if (type === 'onClick') {
      return {
        viewState: {
          ...state.viewState,
          ...payload,
        }
      }
    }
    return state
  }, { viewState: layerArray.includes('poi_draw') ? INIT_VIEW_DRAW_STATE : INIT_VIEW_STATE})
  
  // React Hook to handle setting up viewState based on pois coordinates and deck map container size
  useLayoutEffect(() => {
    if (data.length && width && height && !layerArray.includes('poi_draw')) {
      viewStateDispatch({ type: 'data view', payload: { data, height, width } })
    }
  }, [data, width, height, layerArray])

  // React Hook to handle setting up data for DeckGL layers
  useEffect(() => {
    // Need to set data here so the map renders with current poiData
    setData(poiData)
  }, [poiData])

  // React Hook to update viewState for onClick events
  useEffect(() => {
    viewStateDispatch({ type: 'onClick', payload: onClickPayload })
  }, [onClickPayload])

  const getCurrentCursor = getCursor({ layers, type: 'draw' })

  return (
    <MapWrapper>
      <DeckGL
        ref={ deckRef }
        initialViewState={ viewState }
        layers={ layers }
        controller={ controller }
        getCursor={ getCurrentCursor }
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
