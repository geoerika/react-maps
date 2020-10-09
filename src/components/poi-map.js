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
import POITooltip from './poi-tooltip'
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
  activePoi: PropTypes.object,
  setActivePoi: PropTypes.func,
  layerArray: PropTypes.array,
  onClickHandle: PropTypes.func,
  mode: PropTypes.string,
  controller: PropTypes.object,
  mapProps: PropTypes.object,
  tooltipKeys: PropTypes.array,
}

const defaultProps = {
  poiData: [],
  activePoi: {},
  setActivePoi: () => {},
  layerArray: [],
  onClickHandle: () => {},
  mode: '',
  controller: { controller: true },
  mapProps: {},
  tooltipKeys: ['name', 'id', 'lat', 'lon'],
}

// DeckGL React component
const POIMap = ({
  poiData,
  activePoi,
  setActivePoi,
  layerArray,
  onClickHandle,
  mode,
  controller,
  tooltipKeys,
  ...mapProps
}) => {
  const [data, setData] = useState([])
  const [onClickPayload, setOnClickPayload] = useState({})
  const [hoverInfo, setHoverInfo] = useState(null)
  const deckRef = useRef()
  const { width, height } = useRefDimensions(deckRef)

  /**
   * onClick - React hook that handles various in-house and custom onClick methods
   * @param { object } deckEvent - current deck properties
   */
  const onClick = useCallback(
    (deckEvent) => {
      const { object, layer, coordinate } = deckEvent
      // if clicked object is a cluster, zoom in
      if (object.cluster) {
        const [longitude, latitude] = coordinate
        setOnClickPayload({ longitude, latitude, zoom: layer.state.z + 2 })
      // if clicked object is a point on the map, set it as activePoi and zoom in
      } else if (object.type) {
        const [longitude, latitude] = object.geometry.coordinates
        setActivePoi(object)
        setOnClickPayload({ longitude, latitude, zoom: 15 })
      } else {
        // custom onClick
        onClickHandle(deckEvent, setOnClickPayload)
      }
    }, [setActivePoi, onClickHandle]
  )

  /**
   * onHover - React hook that handles onHover event
   * @param { object } info - object received during onHover event
   */
  const onHover = useCallback((info) => {
    const { object } = info
    if (object?.properties?.id || object?.cluster) {
      setHoverInfo({ isHovering: true })
      if (!object?.cluster) {
        setHoverInfo({ ...info, isHovering: true })
      }
    } else  {
      setHoverInfo(null)
    }
  }, [])

  // set layers for deck.gl map
  const layers = useMemo(() =>
    processLayers(layerArray, { ...mapProps, data, setData, onClick, onHover, mode})
  , [layerArray, mapProps, data, setData, onClick, onHover, mode])


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
    if (activePoi.properties) {
      setData([activePoi])
    } else if (poiData.length)
      setData(poiData)
  }, [poiData, activePoi])

  // React Hook to update viewState for onClick events
  useEffect(() => {
    viewStateDispatch({ type: 'onClick', payload: onClickPayload })
  }, [onClickPayload])

  const getCurrentCursor = getCursor({ layers, hoverInfo })

  return (
    <MapWrapper>
      { hoverInfo?.object && (
        <POITooltip
          info={ hoverInfo }
          tooltipKeys={ tooltipKeys }
        />
      )}
      <DeckGL
        ref={ deckRef }
        initialViewState={ viewState }
        layers={ layers }
        controller={ controller }
        onViewStateChange={ () => setHoverInfo(null) }
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
