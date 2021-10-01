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

import DeckGL from '@deck.gl/react'
import { FlyToInterpolator } from '@deck.gl/core'
import { StaticMap } from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import { WebMercatorViewport } from '@deck.gl/core'

import { FormControlLabel } from '@material-ui/core'
import { Switch } from '@eqworks/lumen-ui'
import { styled, setup } from 'goober'

import DrawButtonGroup from './draw-button-group'
import MapTooltip from '../tooltip'
import tooltipNode from '../tooltip/tooltip-node'

import { processLayers, isClusterZoomLevel } from './utils'
import { setView, createCircleFromPointRadius, getCircleRadiusCentroid } from '../../shared/utils'
import { getCursor, truncate, formatDataPOI } from '../../utils'
import {
  typographyPropTypes,
  typographyDefaultProps,
  tooltipPropTypes,
  tooltipDefaultProps,
  POIMapProps,
  POIMapDefaultProps,
} from '../../shared/map-props'
import {
  TYPE_POLYGON,
  TYPE_RADIUS,
} from '../../constants'


setup(React.createElement)

const MapWrapper = styled('div')`
`

const SwitchContainerCluster = styled('div')`
  position: absolute;
  margin: 15px;
  z-index: 1;
  background-color: white;
  border-radius: 3px;
  padding: 5px;
`

const SwitchContainerRadius = styled('div')`
  position: absolute;
  margin: 15px;
  margin-top: ${props => props.clusterswitch ? 60 : 15}px;
  z-index: 1;
  background-color: white;
  border-radius: 3px;
  padding: 5px;
  width: 154px;
`

const DrawButtonContainer = styled('div')`
  position: absolute;
  right: 15px;
  z-index: 1;
  background-color: white;
  border-radius: 3px;
`

const MapContainer = styled('div', forwardRef)`
  padding: 15px;
  width: 100%;
  height: 100%;
  position: absolute;
`

// initial map view
const INIT_VIEW_STATE = {
  pitch: 25,
  bearing: 0,
  transitionDuration: 2000,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
  minZoom: 0,
}

// initial map view for drawing mode
const INIT_VIEW_CREATE_STATE = {
  pitch: 25,
  bearing: 0,
  transitionDuration: 2000,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 43.661539,
  longitude: -79.361079,
  zoom: 5,
}

const INIT_VIEW = {
  display: INIT_VIEW_STATE,
  edit: INIT_VIEW_STATE,
  create: INIT_VIEW_CREATE_STATE,
  draw: INIT_VIEW_CREATE_STATE,
  emptyMap: INIT_VIEW_STATE,
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
  tooltipProps,
  mapProps,
  typography,
  mapboxApiAccessToken,
  forwardGeocoder,
  geocoderOnResult,
  dataPropertyAccessor,
  formatTooltipTitle,
  formatPropertyLabel,
  formatData,
}) => {
  const [data, setData] = useState([])
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [showIcon, setShowIcon] = useState(false)
  const [createDrawMode, setCreateDrawMode] = useState(false)
  const [allowDrawing, setAllowDrawing] = useState(true)
  const [onClickPayload, setOnClickPayload] = useState({})
  const [hoverInfo, setHoverInfo] = useState(null)
  const [zoom, setZoom] = useState(INIT_VIEW_STATE.zoom)
  const [viewportBBOX, setViewportBBOX] = useState()
  const [showRadius, setShowRadius] = useState(false)
  const [showClusters, setShowClusters] = useState(false)
  const [clusterZoom, setClusterZoom] = useState(false)
  // used to block reset of view state when we transition from the cluster to the icon layer
  const [layerVisibleData, setLayerVisibleData] = useState()
  const mapContainerRef = useRef()
  const deckRef = useRef()
  const mapRef = useRef()
  const [{ width, height }, setDimensions] = useState({})

  // React hook that sets POIType
  const POIType = useMemo(() => {
    if (mode === 'create-point') {
      setShowRadius(true)
      return TYPE_RADIUS.code
    }
    if (mode === 'create-polygon') {
      return TYPE_POLYGON.code
    }
    return activePOI?.properties?.poiType ? activePOI.properties.poiType : POIData[0]?.properties?.poiType
  }, [mode, activePOI, POIData])

  // React hook that sets mapLayers - the layers used by POIMap during various map modes
  const mapLayers = useMemo(() => {
    if (mode === 'empty') {
      return []
    }
    if (mode === 'edit' || mode.endsWith('-draw') || createDrawMode) {
      // this allows displaying an icon on the POI location found by Geodeocder and when drawing a Polygon
      if (mode === 'create-polygon') {
        // only show POIIcon layer when we have a 'Point' feature as activePOI while drawing POIs
        if (activePOI?.geometry?.type === 'Point') {
          return ['POIEditDraw', 'POIIcon']
        }
        return ['POIEditDraw']
      }
      if (mode === 'create-point') {
        // disable drawing layer when we have edited radius while creating a POI, so we can display radius
        if (activePOI?.properties?.radius) {
          return ['POIGeoJson', 'POIIcon']
        }
        return ['POIEditDraw', 'POIIcon']
      }
      return ['POIEditDraw']
    }
    if (POIType === TYPE_RADIUS.code) {
      if (showRadius) {
        return ['POIGeoJson', 'POIIcon']
      }
      if (cluster && showClusters && clusterZoom) {
        return ['POICluster']
      }
      return ['POIIcon']
    }
    if (POIType === TYPE_POLYGON.code) {
      // we show an icon when the geocoder finds only a 'Point' feature and wants to display location on map
      if (showIcon) {
        return ['POIIcon']
      }
      return ['POIGeoJson']
    }
    return []
  }, [mode, activePOI, cluster, showClusters, clusterZoom, POIType, createDrawMode, showRadius, showIcon])

  // React Hook to handle setting up data for DeckGL layers
  useEffect(() => {
    // remove created activePOI from data list if it was added to POI list in poi-manage
    if (mode === 'empty' || !mode || (mode === 'create-polygon' && !activePOI?.properties)) {
      setData([])
    }

    if (!activePOI?.properties && !showIcon) {
      setData(POIData)
    }

    if ((mode === 'display' && activePOI?.properties) ||
        (mode === 'edit' && POIType === TYPE_POLYGON.code) ||
        (mode === 'create-point' && activePOI?.properties?.radius)) {
      setData([activePOI])
      // disable drawing mode when we have edited radius so we can display radius on map
      setCreateDrawMode(false)
    }

    if (mode === 'edit' && POIType === TYPE_RADIUS.code) {
      /**
       * in order to edit the radius of a poi on the map, we create a new GeoJSON circle / polygon
       * feature, based on the poi coordinates and its radius
       */
      const { geometry: { coordinates: centre } } = activePOI
      const { radius } = activePOI.properties
      const createdCircle = createCircleFromPointRadius({ centre, radius })
      setData([{
        geometry: createdCircle.geometry,
        properties: {
          ...activePOI.properties,
          ...createdCircle.properties,
        },
        // keep previous coordinates in order to edit radius based on the centroid of poi
        prevCoordinates: activePOI.geometry.coordinates,
      }])
    }
  }, [POIData, activePOI, mode, POIType, showIcon])

  // define mapMode to separate functionality
  const mapMode = useMemo(() => {
    // drawing mode has an empty data set, so we need to set mapMode for drawing before the next case
    if (mode.endsWith('-draw') || createDrawMode) {
      return 'draw'
    }
    if (mode.startsWith('create-')) {
      return 'create'
    }
    if (mode === 'empty' || !mode) {
      return 'emptyMap'
    }
    // this has to be set before editing modes, otherwise we change the map view while editing
    if (data[0]?.properties?.isOnMapEditing) {
      return 'isOnMapEditing'
    }
    return mode
  }, [mode, createDrawMode, data])

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
      create: {
        type: 'create',
        payload: { data, height, width },
      },
      // we don't adjust view during editing
      isOnMapEditing: {},
      draw: {},
      emptyMap: {
        type: 'empty map',
        payload: INIT_VIEW[mapMode],
      },
    }
  }, [data, height, width, mapMode])

  // React hook that selects feature when map is in editing mode
  useEffect(() => {
    if (['edit', 'isOnMapEditing'].includes(mapMode)) {
      setSelectedFeatureIndexes([0])
    }
  }, [mapMode])

  /**
   * onClick - React hook that handles various in-house and custom onClick methods
   * @param { object } param - object of deck.gl click event
   * @param { object } param.object - clicked object on map
   * @param { object } param.layer - deck.gl layer
   * @param { array } param.coordinate - coordinates of the clicked object
   */
  const onClick = useCallback(({ object, layer, coordinate }) => {
    // if clicked object is a cluster, zoom in
    if (object?.cluster) {
      const [longitude, latitude] = coordinate
      setOnClickPayload({ longitude, latitude, zoom: layer.state.z + 2 })
    // if clicked object is a point on the map, set it as activePOI and zoom in
    } else if (object?.type) {
      const data = [object]
      const [longitude, latitude, zoom] = [...Object.values(setView({ data, height, width }))]
      setActivePOI(object)
      setOnClickPayload({ longitude, latitude, zoom })
    } else {
      // custom onClick
      onClickHandle({ object, layer, coordinate }, setOnClickPayload)
    }
  }, [setActivePOI, onClickHandle, height, width])

  /**
   * onHover - React hook that handles onHover event
   * @param { object } info - object received during onHover event
   */
  const onHover = useCallback((info) => {
    const { object } = info
    if (object?.properties?.id && !object?.cluster) {
      setHoverInfo({ ...info })
    } else  {
      setHoverInfo(null)
    }
  }, [])

  // state viewState
  const [{ viewState }, viewStateDispatch] = useReducer((state, { type, payload }) => {
    if (['data view', 'edit', 'create'].includes(type)) {
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
    if (type === 'empty map') {
      return {
        viewState: payload,
      }
    }
    return state
  }, { viewState: INIT_VIEW[mapMode] })
  
  // FIX: FlyToInterpolator doesn't seem to be trigerred when transitioning from empty map to some data
  // React Hook to handle setting up viewState based on POIs coordinates and deck map container size
  useLayoutEffect(() => {
    if (((mapMode === 'emptyMap' && !data?.length) || data?.length) &&
      viewParam && mapMode && width && height) {
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
   * @param { string } editType - type of edit
   * @param { array } prevCoordinates - previous coordinates of a POI
   */
  const updatePOI = useCallback(({ editedPOIList, editType, prevCoordinates }) => {
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
      editedRadius = getCircleRadiusCentroid({ polygon: editedPOIList[0] }).radius
      const createdCircle = createCircleFromPointRadius({ centre: prevCoordinates, radius: editedRadius })
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
      const { coordinates } = getCircleRadiusCentroid({ polygon: editedPOIList[0] })
      editedPOI = activePOI
      editedCoordinates = { editedlon: coordinates[0], editedlat: coordinates[1] }
      editedPOIList[0].prevCoordinates = coordinates
    }
    // case: rotate
    if (editType.includes('rot')) {
      editedPOI = activePOI
    }
    // allow only one POI to be drawn in POI create modes; keep last drawn point
    if (mode.startsWith('create-')) {
      editedPOI = editedPOIList.pop()
      editedPOIList = [editedPOI]
    }
    setData(editedPOIList)
    setDraftActivePOI({ editedPOI, editedRadius, editedCoordinates })
  }, [activePOI, mode, setDraftActivePOI])

  // layerPool - array of potential layer names
  const layerPool = useMemo(() => (createDrawMode || mode === 'edit' || mode.endsWith('-draw')) ?
    ['POIGeoJson', 'POIEditDraw', 'POIIcon', 'POICluster'] :
    // don't include POIEditDraw layer for editing or drawing unless needed
    ['POIGeoJson', 'POIIcon', 'POICluster']
  ,[mode, createDrawMode])

  // set layers for DeckGL map
  // don't set layers for display and edit modes unless we have POIs in data
  const layers = useMemo(() => {
    if ((data?.length && ((mode === 'display') ||
      (mode === 'edit' && selectedFeatureIndexes.length))) ||
      mode.endsWith('-draw') || mode.startsWith('create-')) {
      return processLayers({ mapLayers, layerPool, props: {
        mapProps,
        data,
        updatePOI,
        onClick,
        onHover,
        mode,
        POIType,
        zoom,
        selectedFeatureIndexes,
      } })
    }
    return []
  }, [
    mapLayers,
    layerPool,
    mapProps,
    data,
    updatePOI,
    onClick,
    onHover,
    mode,
    POIType,
    zoom,
    selectedFeatureIndexes,
  ])

  const getCurrentCursor = getCursor({ layers })

  // set state for clusterZoom
  useEffect(() => {
    if (cluster && showClusters && layerVisibleData?.length && viewportBBOX?.length && zoom) {
      setClusterZoom(isClusterZoomLevel({ layerVisibleData, viewportBBOX, zoom }))
    }
  }, [cluster, showClusters, layerVisibleData, viewportBBOX, zoom])

  // hide radius switch when we have clusters enabled and cluster level zoom
  useEffect(() => {
    if (cluster && clusterZoom && showClusters) {
      setShowRadius(false)
    }
  }, [cluster, showClusters, clusterZoom])

  /**
   * finalTooltipKeys - React hook that returns an object of keys for MapTooltip component
   * @returns { object } - object of tooltip keys
   * { name, id, metricKeys, metricAliases, nameAccessor, idAccessor, metricAccessor}
   */
  const finalTooltipKeys = useMemo(() => {
    const { id, idAccessor, name, nameAccessor } = tooltipKeys
    let metricKeysArray = tooltipKeys?.metricKeys || ['lon', 'lat']
    return {
      ...tooltipKeys,
      id: id || 'id',
      idAccessor: idAccessor || dataPropertyAccessor,
      name: name || 'name',
      nameAccessor: nameAccessor || dataPropertyAccessor,
      metricKeys: metricKeysArray,
      metricAccessor: dataPropertyAccessor,
    }
  }, [tooltipKeys, dataPropertyAccessor])

  // mapCanRender - conditions to render the map
  const mapCanRender = Boolean(useMemo(() =>
    (mapLayers.includes('POIEditDraw') && data[0]?.properties?.poiType === TYPE_POLYGON.code) ||
    (!mapLayers.includes('POIEditDraw') && data.length) ||
    // cases for empty map
    mode === 'empty' ||
    !POIData.length
  ,[data, POIData, mapLayers, mode]))

  return (
    <MapWrapper>
      {POIType === TYPE_RADIUS.code && cluster && mapMode === 'display' && data?.length > 1 && (
        <SwitchContainerCluster>
          <FormControlLabel
            control={
              <Switch
                checked={showClusters}
                onChange={() => setShowClusters(!showClusters)}
              />
            }
            label='Show Clusters'
          />
        </SwitchContainerCluster>
      )}
      {POIType === TYPE_RADIUS.code &&
        ((cluster && showClusters && !clusterZoom) || (cluster && !showClusters) || !cluster) &&
        mapMode === 'display' && (
        <SwitchContainerRadius clusterswitch={cluster && data?.length > 1 ? 'yes' : undefined}>
          <FormControlLabel
            control={
              <Switch
                checked={showRadius}
                onChange={() => setShowRadius(!showRadius)}
              />
            }
            label='Show Radius'
          />
        </SwitchContainerRadius>
      )}
      <MapContainer ref={mapContainerRef}>
        {hoverInfo?.object &&
          <MapTooltip
            info={hoverInfo}
            tooltipProps={tooltipProps}
            typography={typography}
          >
            {tooltipNode({
              tooltipKeys: finalTooltipKeys,
              formatData,
              formatTooltipTitle,
              formatPropertyLabel,
              params: hoverInfo.object.properties,
            })}
          </MapTooltip>
        }
        {mode.startsWith('create-') && (
          <DrawButtonContainer>
            <DrawButtonGroup
              mode={mode}
              // delete values of previous editedPOI before starting to draw another POI
              setDrawModeOn={() => {
                if (allowDrawing) {
                  setCreateDrawMode(true); setDraftActivePOI({ editedPOI: null })
                }
              }}
              onErase={() => { setData([]); setDraftActivePOI({ editedPOI: null }) }}
            />
          </DrawButtonContainer>
        )}
        {mapCanRender && (
          <DeckGL
            ref={deckRef}
            initialViewState={viewState}
            layers={layers}
            controller={controller}
            onLoad={() => {
              const { height, width } = deckRef?.current?.deck
              setDimensions({ height, width })
            }}
            onResize={({ height, width }) => {
              setDimensions({ height, width })
            }}
            /**
             * USE once nebula.gl fixes selectedFeatureIndex out of range value cases (ie [], null)
             * onClick for edit mode to select feature for editing
             * check that selected feature is not a 'guides' sublayer
             * https://github.com/uber/nebula.gl/blob/master/examples/editor/example.js
             * https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
             */
            // onClick={ (info) => {
            //   const index = []
            //   if (['edit', 'isOnMapEditing'].includes(mapMode) && info?.object && !info.isGuide) {
            //     index.push(info.index)
            //     setSelectedFeatureIndexes(index)
            //   }
            //   // we deselect feature during editing when we click outside its limits
            //   if (!info?.object && data[0]) {
            //     setSelectedFeatureIndexes([])
            //     data[0].properties.isOnMapEditing = false
            //   }
            // }}
            onViewStateChange={o => {
              const { viewState } = o
              setZoom(viewState.zoom)
              setViewportBBOX(new WebMercatorViewport(viewState).getBounds())
            }}
            onInteractionStateChange={interactionState => {
              const{ inTransition } = interactionState
              if (inTransition) {
                setAllowDrawing(false)
              } else {
                setAllowDrawing(true)
              }
              setHoverInfo(null)
            }}
            getCursor={getCurrentCursor}
            onAfterRender={() =>
              setLayerVisibleData(deckRef?.current?.pickObjects({ x: 0, y: 0, width, height }))
            }
          >
            <StaticMap
              ref={mapRef}
              mapboxApiAccessToken={mapboxApiAccessToken}
            >
              {mode.startsWith('create-') && (
                <Geocoder
                  mapRef={mapRef}
                  containerRef={mapContainerRef}
                  mapboxApiAccessToken={mapboxApiAccessToken}
                  inputValue=''
                  marker={false}
                  position='top-left'
                  countries='ca, us'
                  language='en'
                  localGeocoder={forwardGeocoder}
                  onResult={({ result: result }) => {
                    // reset state in map before displaying a new geocoder result
                    setCreateDrawMode(false)
                    setShowIcon(false)
                    setDraftActivePOI({ editedPOI: null })
                    geocoderOnResult({ result, POIType }).then((feature) => {
                      setData([feature])
                      /**
                       * particular case when we only find a 'Point' feature and not a 'Polygon'
                       * and we want to display location on the map
                       */
                      if (POIType === 1 && feature?.geometry?.type === 'Point') {
                        setShowIcon(true)
                      }
                    })
                  }}
                />
              )}
            </StaticMap>
          </DeckGL>
        )}
      </MapContainer>
    </MapWrapper>
  )
}

POIMap.propTypes = {
  POIData: PropTypes.array,
  activePOI: PropTypes.object,
  setActivePOI: PropTypes.func,
  setDraftActivePOI: PropTypes.func,
  onClickHandle: PropTypes.func,
  mode: PropTypes.string,
  cluster: PropTypes.bool,
  controller: PropTypes.object,
  forwardGeocoder: PropTypes.func,
  geocoderOnResult: PropTypes.func,
  dataPropertyAccessor: PropTypes.func,
  formatTooltipTitle: PropTypes.func,
  formatPropertyLabel: PropTypes.func,
  formatData: PropTypes.object,
  ...typographyPropTypes,
  ...tooltipPropTypes,
  ...POIMapProps,
  ...StaticMap.propTypes,
}

POIMap.defaultProps = {
  POIData: [],
  activePOI: null,
  setActivePOI: () => {},
  setDraftActivePOI: () => {},
  onClickHandle: () => {},
  mode: '',
  cluster: false,
  controller: { controller: true },
  forwardGeocoder: () => {},
  geocoderOnResult: () => {},
  dataPropertyAccessor: d => d,
  formatTooltipTitle: (title) => truncate(title, 20),
  formatPropertyLabel: d => d,
  formatData: formatDataPOI,
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
  ...POIMapDefaultProps,
  ...StaticMap.defaultProps,
}

export default POIMap
