import React, {
  forwardRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useReducer,
  useRef,
} from 'react'
import PropTypes from 'prop-types'

import DeckGL from 'deck.gl'
import { FlyToInterpolator } from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import { styled, setup } from 'goober'
import { FormControlLabel } from '@material-ui/core'
import { Switch, ThemeProvider } from '@eqworks/react-labs'

import {
  processLayers,
  setView,
  getCursor,
  createCircleFromPointRadius,
  getCircleRadiusCentroid,
} from '../shared/utils'
import { useResizeObserver } from '../hooks'
import POITooltip from './poi-tooltip'
import {
  typographyPropTypes,
  typographyDefaultProps,
  tooltipProps,
  tooltipDefaultProps,
  POIMapProps,
  POIMapDefaultProps,
} from '../shared/map-props'
import {
  TYPE_POLYGON,
  TYPE_RADIUS,
} from '../constants'


setup(React.createElement)

const MapWrapper = styled('div')`
`

const SwitchContainer = styled('div')`
  position: absolute;
  margin: 20px;
  z-index: 1;
  background-color: white;
  padding: 5px;
`

const MapContainer = styled('div', forwardRef)`
  width: 100%;
  height: 100%;
  position: absolute;
`

// initial map view
const INIT_VIEW_STATE = {
  pitch: 25,
  bearing: 15,
  transitionDuration: 3000,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
  minZoom: 0,
}

// initial map view for drawing mode
const INIT_VIEW_DRAW_STATE = {
  pitch: 25,
  bearing: 15,
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
  emptyMap: INIT_VIEW_STATE,
}

const propTypes = {
  POIData: PropTypes.array,
  activePOI: PropTypes.object,
  setActivePOI: PropTypes.func,
  setDraftActivePOI: PropTypes.func,
  onClickHandle: PropTypes.func,
  mode: PropTypes.string,
  cluster: PropTypes.bool,
  controller: PropTypes.object,
}

const defaultProps = {
  POIData: [],
  activePOI: null,
  setActivePOI: () => {},
  setDraftActivePOI: () => {},
  onClickHandle: () => {},
  mode: '',
  cluster: false,
  controller: { controller: true },
}

// DeckGL React component
const POIMap = ({
  POIData,
  activePOI,
  setActivePOI,
  setDraftActivePOI,
  onClickHandle,
  mode,
  cluster,
  controller,
  tooltipKeys,
  typography,
  mapProps,
}) => {
  const [data, setData] = useState([])
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [onClickPayload, setOnClickPayload] = useState({})
  const [hoverInfo, setHoverInfo] = useState(null)
  const [showRadius, setShowRadius] = useState(false)
  const mapContainerRef = useRef()
  const { width, height } = useResizeObserver(mapContainerRef)

  // React hook that sets POIType
  const POIType = useMemo(() =>
    activePOI?.properties ? activePOI?.properties.poiType : POIData[0]?.properties?.poiType
  , [activePOI, POIData])

  // React hook that sets layerArray
  const layerArray = useMemo(() => {
    if (mode === 'edit' || mode.endsWith('-draw')) {
      return ['POIEditDraw']
    }
    if (POIType === TYPE_RADIUS.code) {
      if (showRadius) {
        return ['POIGeoJson', 'POIIcon']
      }
      if (cluster) {
        return ['POICluster']
      }
      return ['POIIcon']
    }
    if (POIType === TYPE_POLYGON.code) {
      return ['POIGeoJson']
    }
    return []
  }, [mode, cluster, POIType, showRadius])

  // React Hook to handle setting up data for DeckGL layers
  useEffect(() => {
    if (!activePOI?.properties) {
      return setData(POIData)
    }
    if ((mode === 'display' && activePOI?.properties) ||
        (mode === 'edit' && POIType === TYPE_POLYGON.code)) {
      return setData([activePOI])
    }
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
  }, [POIData, activePOI, mode, POIType, layerArray])

  // define mapMode to separate functionality
  const mapMode = useMemo(() => {
    // drawing mode has an empty data set, so we need to set mapMode for drawing before the next case
    if (mode.endsWith('-draw')) {
      return 'draw'
    }
    if (!data.length) {
      return 'emptyMap'
    }
    // this has to be set before editing modes, otherwise we change the map view while editing
    if (data[0]?.properties?.isOnMapEditing) {
      return 'isOnMapEditing'
    }
    return mode
  }, [mode, data])

  // set viewParam for different map modes
  // this means that we don't reset viewPort during drawing
  const viewParam = useMemo(() => {
    return {
      display: {
        type: 'data view',
        payload: { data, height, width },
      },
      edit: {
        type: 'edit',
        payload: { data, height, width },
      },
      // we don't adjust view during editing
      isOnMapEditing: {},
      draw: {},
      emptyMap: {},
    }  
  }, [data, height, width])

  // React hook that selects feature when map is in editing mode
  useEffect(() => {
    if (['edit', 'isOnMapEditing'].includes(mapMode)) {
      setSelectedFeatureIndexes([0])
    }
  }, [mapMode])

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
        setOnClickPayload({ longitude, latitude, zoom })
      } else {
        // custom onClick
        onClickHandle(deckEvent, setOnClickPayload)
      }
    }, [setActivePOI, onClickHandle, height, width],
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
        },
      }  
    }
    if (type === 'onClick') {
      return {
        viewState: {
          ...state.viewState,
          ...payload,
        },
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
    editedPOIList[0].properties.isOnMapEditing = true
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
    processLayers(layerArray, {
      mapProps,
      data,
      updatePOI,
      onClick,
      onHover,
      mode,
      POIType,
      selectedFeatureIndexes,
    })
  , [layerArray, mapProps, data, updatePOI, onClick, onHover, mode, POIType, selectedFeatureIndexes])

  /**
   * toggleRadius - React hook that toggles showRadius state
   */
  const toggleRadius = useCallback(
    () => {
      setShowRadius(!showRadius)
    }, [showRadius])

  const getCurrentCursor = getCursor({ layers, hoverInfo })

  return (
    <ThemeProvider>
      <MapWrapper>
        { POIType === TYPE_RADIUS.code && !cluster && mode !=='edit' && (
          <SwitchContainer>
            <FormControlLabel
              control={
                <Switch
                  checked={ showRadius }
                  onChange={ () => toggleRadius() }
                />
              }
              label='Show Radius'
            />
          </SwitchContainer>
        )}
        <MapContainer ref={ mapContainerRef }>
          { hoverInfo?.object && (
            <POITooltip
              info={ hoverInfo }
              typography={ typography }
              tooltipKeys={ tooltipKeys }
            />
          ) }
          <DeckGL
            initialViewState={ viewState }
            layers={ layers }
            controller={ controller }
            /**
             * onClick for edit mode to select feature for editing
             * check that selected feature is not a 'guides' sublayer
             * https://github.com/uber/nebula.gl/blob/master/examples/editor/example.js
             * https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
             */
            onClick={ (info) => {
              const index = []
              if (['edit', 'isOnMapEditing'].includes(mapMode) && info?.object && !info.isGuide) {
                index.push(info.index)
                setSelectedFeatureIndexes(index)
              }
              // we deselect feature during editing when we click outside its limits
              if (!info?.object && data[0]) {
                setSelectedFeatureIndexes([])
                data[0].properties.isOnMapEditing = false
              }
            }}
            onViewStateChange={ () => setHoverInfo(null) }
            getCursor={ getCurrentCursor }
          >
            <StaticMap
              mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN }
            />
          </DeckGL>
        </MapContainer>
      </MapWrapper>
    </ThemeProvider>
  )
}

POIMap.propTypes = {
  ...typographyPropTypes,
  ...tooltipProps,
  ...POIMapProps,
  ...propTypes,
}
POIMap.defaultProps = {
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
  ...POIMapDefaultProps,
  ...defaultProps,
}
export default POIMap
