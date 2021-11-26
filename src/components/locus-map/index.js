import React, { useState, useEffect, useMemo, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'

import { MVTLayer } from '@deck.gl/geo-layers'
import tUnion from '@turf/union'

import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import { useLegends } from './hooks'
import { setView, parseDeckGLLayerFromConfig, getTooltipParams, getObjectMVTData } from './utils'
import Map from '../generic-map'
import MapTooltip from '../tooltip'
import tooltipNode from '../tooltip/tooltip-node'
import Legend from '../legend'
import { LAYER_CONFIGURATIONS } from './constants'


const LocusMap = ({
  dataConfig,
  layerConfig,
  mapConfig,
}) => {
  const [finalDataConfig, setFinalDataConfig] = useState([])
  const [viewStateOverride, setViewOverride] = useState({})
  const [{ height, width }, setDimensions] = useState({})
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [selectShape, setSelectShape] = useState([])
  const [renderedFeatures, setRenderedFeatures] = useState([])
  const [renderCycleMVT, setRenderCycleMVT] = useState(0)

  // set controller for Map comp
  const controller = useMemo(() => {
    const layerList = layerConfig.reduce((agg, layer) => [...agg, layer.layer], [])
    if (layerList?.includes('select' )) {
      return { doubleClickZoom: false }
    }
    return { controller: true }
  }, [layerConfig])

  // set state for layers and data
  const [{ layers }, configurableLayerDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'init') {
      const { dataConfig, layerConfig } = payload
      // ====[NOTE] ids are for single-use sessions
      // ====[TODO] more thorough ID functions
      const dataIdMap = {}
      const data = dataConfig.reduce((agg, { id, data }, i) => {
        const newId = `data-${new Date().getTime()}-${i}`
        dataIdMap[id] = newId
        return {
          ...agg,
          [newId]: data,
        }
      }, {})

      let layers = layerConfig.reduce((agg, layer, i) => {
        const id = `layer-${layer.layer}-${new Date().getTime()}-${i}`
        // ====[TODO] fallback for invalid/missing dataId
        return {
          ...agg,
          [id]: {
            config: layer,
            deckLayer: parseDeckGLLayerFromConfig({
              ...layer,
              selectedFeatureIndexes,
              setSelectShape,
              id,
            })(data[dataIdMap[layer.dataId]]),
          },
        }
      }, {})

      layers = state.layers['MVTRenderedFeatures'] ?
        {
          ['MVTRenderedFeatures']: state.layers['MVTRenderedFeatures'],
          ...layers,
        } :
        layers
      return {
        ...state,
        data,
        layers,
      }
    }

    if (type === 'select') {
      const { data } = payload
      const { layers } = state
      let selectLayer = {}

      for (const id in layers) {
        if (layers[id].config.layer === 'select') {
          selectLayer = {
            [id]: {
              ...layers[id],
              deckLayer: parseDeckGLLayerFromConfig({
                ...layers[id].config,
                id,
                selectedFeatureIndexes,
                setSelectShape,
              })(data),
            },
          }
        }
      }
      return {
        ...state,
        layers: {
          ...layers,
          ...selectLayer,
        },
      }
    }

    if (type === 'get GeoJSONMVT') {
      const { layer } = payload
      return {
        ...state,
        layers: {
          ...state.layers,
          ...layer,
        },
      }
    }

    return state
  }, { data: {}, layers: {} })

  // get all geometry for polygons in the viewport from MVT binary file
  const onViewportLoad = useCallback(tiles => {
    let renderedTiles = []
    tiles?.forEach(tile => {
      // data in world coordinates (WGS84)
      renderedTiles = tile.dataInWGS84 ? [...renderedTiles, ...tile.dataInWGS84] : renderedTiles
    })
    setRenderCycleMVT(o => o + 1)
    setRenderedFeatures(renderedTiles)
  }, [])

  // create MVT layer to get all geometry for polygons in the viewport
  useEffect(() => {
    const geoJSONLayer = layerConfig.find(layer => layer?.layer === 'geojson')
    if (geoJSONLayer) {
      const geoJSONLayerData = dataConfig.find(layerData => layerData.id === geoJSONLayer.dataId).data
      const id = 'MVTRenderedFeatures'
      if (geoJSONLayerData?.tileGeom) {
        const mvtLayer = new MVTLayer({
          id,
          data: geoJSONLayerData?.tileGeom,
          getFillColor: [251, 201, 78],
          pickable: false,
          visible: true,
          opacity: 0,
          showLegend: false,
          onViewportLoad,
        })
        configurableLayerDispatch({
          type: 'get GeoJSONMVT',
          payload: {
            layer: {
              [id]: { deckLayer: mvtLayer },
            },
          },
        })
      }
    }
  }, [layerConfig, dataConfig, onViewportLoad])

  // set finalDataConfig, taking care of the case when reading geometry from MVT layer
  useEffect(() => {
    const geoJSONLayer = layerConfig.find(layer => layer?.layer === 'geojson')
    if (geoJSONLayer) {
      const dataId = geoJSONLayer?.dataId
      const geoKey = geoJSONLayer?.geometry?.geoKey || LAYER_CONFIGURATIONS.MVT.geometry.geoKey
      const layerData = dataConfig.find(layerData => layerData.id === dataId).data
      const tileData = layerData?.tileData
      if (tileData?.length) {
        if (renderedFeatures.length) {
          const tileDataObj = tileData.reduce((objData, item) => {
            const id = item[geoKey]
            objData[id] = { ...item }
            return objData
          }, {})
          // combine geometry from MVT layer with data
          const combinedData = renderedFeatures.reduce((objData, item) => {
            const id = item.properties?.geo_id
            if (tileDataObj[id]) {
              let newPoly = item
              // merge polygons/multipolygons of a geo_id from different tiles into one single polygon/multipolygon
              if (objData[id]) {
                newPoly = tUnion(objData[id], item)
              }
              objData[id] = {
                ...newPoly,
                properties:
                {
                  ...item.properties,
                  value: tileDataObj[id].value,
                },
              }
            }
            return objData
          }, {})
          const finalData = Object.values(combinedData)
          // add final data array for geojson layer
          setFinalDataConfig([...dataConfig.filter(o => o.id !== dataId), { id: dataId, data: finalData }])
        }
      } else {
        setFinalDataConfig(dataConfig)
      }
    } else {
      setFinalDataConfig(dataConfig)
    }
  }, [layerConfig, dataConfig, renderedFeatures])

  // set initial layers and their corresponding data
  useEffect(() => {
    if (finalDataConfig.length) {
      configurableLayerDispatch({
        type: 'init',
        payload: { layerConfig, dataConfig: finalDataConfig },
      })
    }
  }, [layerConfig, finalDataConfig, dataConfig])

  // // adjust viewport based on data
  useEffect(() => {
    if (width && height && finalDataConfig.length && !renderCycleMVT) {
      // recenter based on data
      let dataGeomList = []
      layerConfig.forEach(layer => {
        if (!['arc', 'MVT', 'select'].includes(layer.layer)) {
          const data = finalDataConfig.find(elem => elem.id === layer.dataId)?.data
          if (data?.length) {
            dataGeomList = [...dataGeomList, { data, ...layer.geometry }]
          }
        }
      })
      const dataView = dataGeomList?.length ? setView({ dataGeomList, width, height }) : {}
      // don't adjust viewport when layer is 'arc', 'MVT', or 'select'
      if (!selectShape.length) {
        setViewOverride(o => ({
          ...o,
          ...dataView,
        }))
      }
    }
  }, [finalDataConfig, layerConfig, selectShape, renderedFeatures, renderCycleMVT, height, width])

  // update state for 'select' layer
  useEffect(() => {
    const selectActive = layerConfig.find(layer => layer.layer === 'select')
    if (selectActive && selectShape.length) {
      setSelectedFeatureIndexes([0])
      configurableLayerDispatch({ type: 'select', payload: { data: selectShape } })
    }
  }, [layerConfig, selectShape])

  // get all config data for all layer legends
  const legends = useLegends({ dataConfig: finalDataConfig, layerConfig })

  // set legend element
  const legend = useMemo(() => {
    return (mapConfig.showMapLegend && (mapConfig.legendNode ||
      (legends?.length > 0 &&
        <Legend
          legends={legends}
          { ...mapConfig }
        />
      )
    ))}, [legends, mapConfig])

  /**
   * need to memoize map component so it doesn't render for each state change
   * this eliminates errors in re-rendering layers on the map when state changes
   */
  const locusMap = useMemo(() => (
    <Map
      layers={Object.values(layers).map(o => o.deckLayer)}
      setDimensionsCb={(o) => setDimensions(o)}
      viewStateOverride={viewStateOverride}
      controller={controller}
      { ...mapConfig }
      getCursor={mapConfig.cursor ?
        mapConfig.cursor(Object.values(layers).map(o => o.deckLayer)) :
        () => {}
      }
      showTooltip={mapConfig.showMapTooltip}
      renderTooltip={({ hoverInfo }) => {
        const { tooltipProps, ...tooltipParams } = getTooltipParams({ hoverInfo })
        const objMVTData = hoverInfo.layer.id.includes('MVT') ?
          getObjectMVTData({ dataConfig: finalDataConfig, hoverInfo }) :
          {}
        const { layer : { props: { interactions } } } = hoverInfo
        const tooltip = interactions?.tooltip
        if (tooltip) {
          return (
            <MapTooltip
              info={hoverInfo}
              tooltipProps={tooltipProps}
              typography={mapConfig.typography || typographyDefaultProps.typography}
            >
              {mapConfig.tooltipNode ||
                tooltipNode({
                  ...tooltipParams,
                  params: {
                    ...hoverInfo.object,
                    properties: {
                      ...hoverInfo.object.properties,
                      ...objMVTData,
                    },
                  },
                })
              }
            </MapTooltip>
          )
        }
        return null
      }}
    />
  ), [controller, finalDataConfig, mapConfig, layers, viewStateOverride ])

  return (
    <>
      {locusMap}
      {legend}
    </>
  )
}

LocusMap.propTypes = {
  dataConfig: PropTypes.array.isRequired,
  layerConfig: PropTypes.array.isRequired,
  mapConfig: PropTypes.shape({
    cursor: PropTypes.func,
    legendPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
    legendSize: PropTypes.oneOf(['full', 'widget']),
    legendNode: PropTypes.node,
    showMapLegend: PropTypes.bool,
    tooltipNode: PropTypes.node,
    showMapTooltip: PropTypes.bool,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    typography: PropTypes.object,
  }).isRequired,
  ...typographyPropTypes,
}

LocusMap.defaultProps = {
  ...typographyDefaultProps,
}

export default LocusMap
