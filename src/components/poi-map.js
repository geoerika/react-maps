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

import {
  processLayers,
  setView,
  getCursor,
  createCircleFromPointRadius,
  getCircleRadiusCentroid,
} from '../shared/utils'
import POITooltip from './poi-tooltip'
import {
  typographyPropTypes,
  typographyDefaultProps,
  tooltipProps,
  tooltipDefaultProps
} from '../shared/map-props'
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

const INIT_VIEW = {
  display: INIT_VIEW_STATE,
  edit: INIT_VIEW_STATE,
  draw: INIT_VIEW_DRAW_STATE,
}

const propTypes = {
  POIData: PropTypes.array,
  activePOI: PropTypes.object,
  setActivePOI: PropTypes.func,
  setDraftActivePOI: PropTypes.func,
  layerArray: PropTypes.array,
  onClickHandle: PropTypes.func,
  mode: PropTypes.string,
  controller: PropTypes.object,
  mapProps: PropTypes.object,
}

const defaultProps = {
  POIData: [],
  activePOI: {},
  setActivePOI: () => {},
  setDraftActivePOI: () => {},
  layerArray: [],
  onClickHandle: () => {},
  mode: '',
  controller: { controller: true },
  mapProps: {},
}

// DeckGL React component
const POIMap = ({
  POIData,
  activePOI,
  setActivePOI,
  setDraftActivePOI,
  layerArray,
  onClickHandle,
  mode,
  controller,
  tooltipKeys,
  typography,
  ...mapProps
}) => {
  const [data, setData] = useState([])
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [onClickPayload, setOnClickPayload] = useState({})
  const [hoverInfo, setHoverInfo] = useState(null)
  const deckRef = useRef()
  const { width, height } = useRefDimensions(deckRef)

  // React Hook to handle setting up data for DeckGL layers
  useEffect(() => {
    if (activePOI?.properties) {
      if (mode === 'poi-point-radius-edit') {
        /**
         * in order to edit the radius of a poi on the map, we create a new GeoJSON circle / polygon
         * feature, based on the poi's coordinates and its radius
         */
        const { geometry: { coordinates: centre } } = activePOI
        const { radius } = activePOI.properties
        const createdCircle = createCircleFromPointRadius(centre, radius)
        setData([{
          geometry: createdCircle.geometry,
          properties: {
            ...activePOI.properties,
            ...createdCircle.properties,
          },
          // keep previous coordinates of poi to use to edit poi radius
          prevCoordinates: activePOI.geometry.coordinates,
        }])
      } else {
        setData([activePOI])
      }
    } else {
      setData(POIData)
    }
  }, [POIData, activePOI, layerArray, mode])

  // define mapMode to separate functionality
  const mapMode = useMemo(() => {
    if (mode.includes('point-draw') || mode.includes('polygon-draw')) {
      return 'draw'
    }
    // this has to be set before editing modes, otherwise we change the map view while editing
    if (data[0]?.properties?.isEditing) {
      return 'isEditing'
    }
    if (mode.includes('poi-edit') || mode.includes('poi-point-radius-edit')) {
      return 'edit'
    }
    return 'display'
  }, [mode, data])

  // set viewParam for different map modes
  // this means that we don't reset viewPort during drawing
  const viewParam = useMemo(() => {
    return {
      display: {
        type: 'data view',
        payload: { data, height, width }
      },
      edit: {
        type: 'edit',
        payload: { data, height, width },
      },
      // we don't adjust view during editing
      isEditing: {},
      draw: {},
    }  
  }, [data, height, width])

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
      // if clicked object is a point on the map, set it as activePOI and zoom in
      } else if (object.type) {
        const data = [object]
        const [longitude, latitude, zoom] = [...Object.values(setView({ data, height, width }))]
        setActivePOI(object)
        setOnClickPayload({ longitude, latitude, zoom: zoom })
      } else {
        // custom onClick
        onClickHandle(deckEvent, setOnClickPayload)
      }
    }, [setActivePOI, onClickHandle, height, width]
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

  // state viewState
  const [{ viewState }, viewStateDispatch] = useReducer((state, { type, payload }) => {
    if ((type === 'data view') || (type === 'edit')) {
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
  }, { viewState: INIT_VIEW[mapMode] })
  
  // React Hook to handle setting up viewState based on POIs coordinates and deck map container size
  useLayoutEffect(() => {
    if (data.length && width && height) {
      viewStateDispatch(viewParam[mapMode])
    }
  }, [data, width, height, viewParam, mapMode])

  // React Hook to handle setting up data for DeckGL layers
  useEffect(() => {
    if (activePOI?.properties) {
      if (mode === 'poi-point-radius-edit') {
        /**
         * in order to edit the radius of a poi on the map, we create a new GeoJSON circle / polygon
         * feature, based on the poi coordinates and its radius
         */
        const { geometry: { coordinates: centre } } = activePOI
        const { radius } = activePOI.properties
        const createdCircle = createCircleFromPointRadius(centre, radius)
        setData([{
          geometry: createdCircle.geometry,
          properties: {
            ...activePOI.properties,
            ...createdCircle.properties,
          },
          // keep previous coordinates in order to edit radius based on the centroid of poi
          prevCoordinates: activePOI.geometry.coordinates,
        }])
      } else {
        setData([activePOI])
      }
    } else {
      setData(POIData)
    }
  }, [POIData, activePOI, layerArray, mode])

  // React Hook to update viewState for onClick events
  useEffect(() => {
    viewStateDispatch({ type: 'onClick', payload: onClickPayload })
  }, [onClickPayload])

  /**
   * updatePOI - React hook that updates data on the map and activePOI with the edited / drawn features
   * @param { array } editedPOIList - updated / drawn feature list
   */
  const updatePOI = useCallback((editedPOIList, editType, prevCoordinates) => {
    // we signal the map that we are actively editing so the map doesn't adjust view
    editedPOIList[0].properties.isEditing = true
    let editedRadius = null
    let editedCoordinates = null
    let editedPOI = editedPOIList[0]
    /**
     * If we change radius of a poi, we keep previous coordinates of the edited circle and calculate
     * new circle coordinates based on the edited radius. We do this because nebula.gl TransformMode
     * scales objects relative to a point of a surrounding box and not relative to the object's centroid.
     * https://nebula.gl/geojson-editor/
     */
    // case: scale
    if (editType.includes('scal')) {
      // change only radius, not coordinates; recalculate circle points for new radius to show on the map
      editedPOI = activePOI
      editedRadius = getCircleRadiusCentroid(editedPOIList[0]).radius
      const createdCircle = createCircleFromPointRadius(prevCoordinates, editedRadius)
      editedPOIList = [{
        geometry: createdCircle.geometry,
        properties: {
          ...editedPOIList[0].properties,
          editradius: editedRadius,
          radius: editedRadius,
        },
        prevCoordinates: prevCoordinates,
      }]
    }
    // case: translate
    if (editType.includes('transl')) {
      const { coordinates } = getCircleRadiusCentroid(editedPOIList[0])
      editedPOI = activePOI
      editedCoordinates = coordinates
      editedPOIList[0].prevCoordinates = coordinates
    }
    // case: rotate
    if (editType.includes('rot')) {
      editedPOI = activePOI
    }
    setData(editedPOIList)
    setDraftActivePOI({ editedPOI, editedRadius, editedCoordinates })
  }, [activePOI, setDraftActivePOI])

  // set layers for deck.gl map
  const layers = useMemo(() =>
    processLayers(layerArray, { ...mapProps, data, updatePOI, onClick, onHover, mode, selectedFeatureIndexes})
  , [layerArray, mapProps, data, updatePOI, onClick, onHover, mode, selectedFeatureIndexes])

  const getCurrentCursor = getCursor({ layers, hoverInfo })

  return (
    <MapWrapper>
      { hoverInfo?.object && (
        <POITooltip
          info={ hoverInfo }
          typography={ typography }
          tooltipKeys={ tooltipKeys }
        />
      )}
      <DeckGL
        ref={ deckRef }
        initialViewState={ viewState }
        layers={ layers }
        controller={ controller }
        /**
         * onClick for edit mode to select feature for editing
         * check that selected feature is not a 'guides' sublayer
         * https://github.com/uber/nebula.gl/blob/master/examples/editor/example.js
         * https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
         */
        onClick={ (info) => (
          (mapMode === 'edit' || mapMode === 'isEditing') &&
          info?.object &&
          !info.isGuide) ?
          setSelectedFeatureIndexes([info.index]) :
          setSelectedFeatureIndexes([])
        }
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

POIMap.propTypes = {
  ...typographyPropTypes,
  ...tooltipProps,
  ...propTypes
}
POIMap.defaultProps = {
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
  ...defaultProps
}
export default POIMap
