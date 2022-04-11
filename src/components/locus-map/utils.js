import { WebMercatorViewport } from '@deck.gl/core'
import { DrawCircleByDiameterMode, DrawRectangleMode, DrawPolygonMode } from '@nebula.gl/edit-modes'

import { setFinalLayerDataProperty, getSchemeColorValues, strToArrayColor } from '../../shared/utils'
import {
  PROP_CONFIGURATIONS,
  LAYER_CONFIGURATIONS,
  LAYER_TYPES,
  PROP_TYPES,
} from './constants'
import { GEOJSON_TYPES } from '../../constants'


/**
 * parseDeckGLLayerFromConfig - sets up layer props & returns deck.gl layer
 * @param { object } param
 * @param { string } param.id - deck.gl layer id
 * @param { object } param.geometry - object of geometry props specific to layer
 * @param { object } param.visualizations - object of layer visualisations
 * @param { object } param.interactions - object of layer interactions (ex: click, tooltip)
 * @param { object } param.others - the rest of layer configurations
 * @returns { instanceOf } { deck.gl Layer } - deck.gl map layer
 */
export const parseDeckGLLayerFromConfig = ({
  id,
  layer,
  geometry,
  visualizations,
  interactions = {},
  setProcessingMapData,
  ...others
}) => {
  const {
    dataPropertyAccessor: layerPropertyAccessor,
    geometry: layerGeom,
    deckGLClass: Layer,
    defaultProps,
    visualizations: layerVisualizations,
  } = LAYER_CONFIGURATIONS[layer]

  const { layerMode, formatData } = others
  const dataPropertyAccessor = others?.dataPropertyAccessor || layerPropertyAccessor
  const geometryAccessor = geometry?.geometryAccessor || layerGeom?.geometryAccessor
  const layerGeometry = geometry || layerGeom
  const mvtGeoKey = geometry?.geoKey || layerGeom?.geoKey

  let mode = null

  switch(layerMode) {
    case 'circle':
      mode = DrawCircleByDiameterMode
      break
    case 'rectangle':
      mode = DrawRectangleMode
      break
    case 'polygon':
      mode = DrawPolygonMode
      break
    default:
      mode = undefined
      break
  }

  // ====[NOTE] if a layer requires explicit geometry (all except GeoJson?)
  // =========] pass its configured values (references to data fields) to final propFn
  let geometryProps = {}
  if (layerGeom?.propName) {
    geometryProps = { [layerGeom.propName]: layerGeom.propFn({ geometryAccessor, ...geometry }) }
  }
  if(layerGeom?.source) {
    geometryProps = {
      [layerGeom.source.propName] : layerGeom.source.propFn({ geometryAccessor, ...geometry.source }),
      [layerGeom.target.propName] : layerGeom.target.propFn({ geometryAccessor, ...geometry.target }),
    }
  }
  if (layer === LAYER_TYPES.MVT) {
    geometryProps = { geoKey: mvtGeoKey, geometryAccessor }
  }

  // signals that MVT tiles are loaded and the Loader in LocusMap can be removed
  const onViewportLoad = tiles => {
    if (tiles?.length) {
      setProcessingMapData(false)
    }
  }

  const { schemeColor } = others
  // generate colours for stroke and fill from the base schemeColour
  const {
    newLineColor,
    newLabelColor,
    newColorValue,
    newColorValueOptions,
  } = schemeColor ? getSchemeColorValues(schemeColor) : {}

  let extruded, parameters

  // ====[TODO] calculate field extents in advance, so every configurable aspect doesn't need to
  const propsWithData = ({ data, highlightId }) => ({
    // ====[TODO] trim invalid visualization values for a given layer
    ...layerVisualizations.reduce((agg, name) => {
      const config = visualizations[name] || {}
      let { deckGLName, defaultValue, byProducts = {} } = PROP_CONFIGURATIONS[name]

      /*
       * there is a complication with 'defaultValue' for radius & fill, both need a default value
       * for the cases when a 'value' and a 'valueOptions' are not provided by the user, hence the
       * changes below
       */
      let value = config?.value
      // no valueOptions needed for radius for GeoJSON layer
      let valueOptions =
        layer === LAYER_TYPES.geojson && name === PROP_TYPES.radius?
          null:
          config?.valueOptions || defaultValue.valueOptions

      if (defaultValue && !Array.isArray(defaultValue) && typeof defaultValue === 'object') {
        defaultValue = defaultValue.value
      }

      // change colour values with schemeColour generated colours
      if (schemeColor && name === PROP_TYPES.lineColor) {
        value = newLineColor
      }
      if (!value?.field && schemeColor && name === PROP_TYPES.fill) {
        value = newColorValue
      }
      if (value?.field && schemeColor && name === PROP_TYPES.fill) {
        valueOptions = newColorValueOptions
      }
      if (!value?.field && schemeColor && name === PROP_TYPES.color && layer === LAYER_TYPES.text) {
        value = newLabelColor
      }

      // convert color value for text layer in an array format
      if (value && name === PROP_TYPES.color && typeof value === 'string') {
        value = strToArrayColor({ strColor: value })
      }

      /*
       * out of all byProducts, 'extruded' and 'parameters.depthTest' props have to be generally
       * false, except when a layer uses elevation; stroked is by default false in deck.gl layers,
       * however, for LocusMap we set it true unless a user provides a custom value, as with the
       * case for all byProducts
       */
      if (name === PROP_TYPES.elevation) {
        [extruded, parameters] = value?.field ?
          [byProducts.extruded, byProducts.parameters] :
          [defaultProps.extruded, defaultProps.parameters]
      }

      return {
        ...agg,
        [deckGLName]: setFinalLayerDataProperty({
          ...config,
          data,
          value,
          valueOptions,
          defaultValue,
          dataPropertyAccessor,
          mvtGeoKey,
          geometryAccessor,
          highlightId,
          formatData,
        }),
        ...byProducts,
        extruded,
        parameters,
      }
    }, {}),
  })

  const { click, hover, tooltip, highlight, labels } = interactions

  const setLayerData = (data) => {
    if (layer === LAYER_TYPES.MVT) {
      return data?.tileGeom
    }
    if (layer === LAYER_TYPES.select) {
      return { type: 'FeatureCollection', features: data }
    }
    return data
  }

  return data => new Layer({
    id,
    data: setLayerData(data),
    // ====[TODO] logic for below
    // updateTriggers
    mode,
    visualizations,
    interactions,
    dataPropertyAccessor,
    ...defaultProps,
    ...propsWithData({ data }),
    ...geometryProps,
    layerGeometry,
    pickable: Boolean(click || hover || tooltip || highlight || labels ||
      (layer === LAYER_TYPES.select)),
    onEdit: layer !== LAYER_TYPES.select ?
      () => {} :
      ({ updatedData }) => {
        const { setSelectShape } = others
        /**
         * need condition here otherwise we get errors when we draw as updatedData.features is updated
         * only when we finish drawing a point or an entire polygon
         */
        if (updatedData?.features?.length && (!data.length ||
          // these conditions are for calling setSelectShape only when we have new edited / created geometries
          (data.length && !data.includes(updatedData.features[updatedData.features.length - 1])))) {
          setSelectShape(updatedData.features)
        }
      },
    onViewportLoad: layer === LAYER_TYPES.MVT  ? onViewportLoad : null,
    visible: Boolean(data?.length) || Boolean(data?.tileData?.length) ||
      (layer === LAYER_TYPES.select),
    ...others,
  })
}

/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @param { object } param
 * @param { array } param.dataGeomList - array of data arrays and associated geometry to display on the map
 * @param { number } param.width - deck container width
 * @param { number } param.height - deck container height
 * @returns { object } { latitude, longitude, zoom } - lat, long, and zoom for new viewState
 */
export const setView = ({ dataGeomList, width, height }) => {
  const dataCoordinateArray = dataGeomList.map(({ data, longitude, latitude, geometryAccessor = d => d }) =>
    getDataCoordinates({ data, longitude, latitude, geometryAccessor })).flat()

  const formattedGeoData = dataCoordinateArray.reduce(
    ([[minLng, minLat], [maxLng, maxLat]], coords) => {
      const [lng, lat] = coords
      return [
        [Math.min(minLng, lng), Math.min(minLat, lat)],
        [Math.max(maxLng, lng), Math.max(maxLat, lat)],
      ]
    }, [[180, 90], [-180, -90]])

  const dataLonDiff = formattedGeoData[0][0] - formattedGeoData[1][0]
  /**
   * -120 is the diff in longitude between the westernmost and easternmost points of
   * North America: (-172 - (-52)) = -120
   * Compare to the diff in longitude between westernmost point of NA and easternmost point of
   * Australia: -172 - (+153) = -325
   * We need to reduce padding with map container shrinking size,
   * otherwise fitBounds breaks when padding is greater than map dimensions.
   */
  let padding = Math.min(width, height) / 4
  if (dataLonDiff > -120) {
    padding = Math.min(width, height) / 10
  } else if (Math.min(width, height) / 2 > 75) {
    padding =  75
  }

  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding })

  let { longitude, latitude, zoom } = viewPort

  return { longitude, latitude, zoom }
}

/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { object } param
 * @param { array } param.data - location data array
 * @param { function } param.geometryAccessor - function to help access geometry in the data set
 * @param { string } param.longitude - longitude key in data object
 * @param { string } param.latitude - latitude key in data object
 * @returns { array } - coordinates that define the boundary area where the data is located
 */
export const getDataCoordinates = ({ data, geometryAccessor, longitude, latitude }) => {
  let POIType
  let coordinateArray = []
  if (data[0]?.geometry?.type) {
    POIType = data[0]?.geometry?.type
    coordinateArray = data.reduce((acc, item) => {
      // POIType has to be read for each element as MVT binary file has a mix of polygons & multipolygons
      POIType = item.geometry?.type
      if (POIType === GEOJSON_TYPES.polygon) {
        return [...acc, ...item.geometry?.coordinates.flat()]
      }
      if (POIType === GEOJSON_TYPES.multipolygon) {
        return [...acc, ...item.geometry?.coordinates.flat().flat()]
      }
      return [...acc, item.geometry?.coordinates]
    }, [])
  } else {
    coordinateArray = data.reduce((acc, item) =>
      [...acc, [geometryAccessor(item)?.[longitude], geometryAccessor(item)?.[latitude]]], [])
  }

  const [minCoords, maxCoords] = coordinateArray.reduce(
    ([[minLng, minLat], [maxLng, maxLat]], item) => {
      const [lng, lat] = item
      return [
        [Math.min(minLng, lng), Math.min(minLat, lat)],
        [Math.max(maxLng, lng), Math.max(maxLat, lat)],
      ]
    }, [[180, 90], [-180, -90]])

  return [ minCoords, maxCoords ]
}

/**
 * getTooltipParams - gets all props related to tooltip component
 * @param { object } param
 * @param { object } param.hoverInfo - object of hovered element on the map
 * @returns { object } - object of tooltip component keys and values
 */
export const getTooltipParams = ({ hoverInfo }) => {
  const { layer: { props: layerProps } } = hoverInfo
  const {
    visualizations,
    dataPropertyAccessor,
    formatData,
    formatPropertyLabel,
    metricAliases,
    interactions,
  } = layerProps

  const { tooltipKeys, formatTooltipTitle, tooltipProps } = interactions?.tooltip || {}
  const fillBasedOn  = visualizations?.fill?.value?.field
  const radiusBasedOn  = visualizations?.radius?.value?.field
  const elevationBasedOn  = visualizations?.elevation?.value?.field

  const {
    name,
    id,
    metricKeys,
    metricAccessor,
    nameAccessor,
    idAccessor,
  } = tooltipKeys ? tooltipKeys : {}
  const metricKeysArray = [...(tooltipKeys?.metricKeys || [])]
  // set metricKeys array if no custom keys are given
  if (!metricKeys?.length) {
    ([radiusBasedOn, fillBasedOn, elevationBasedOn]).forEach((key) => {
      if (key) {
        metricKeysArray.push(key)
      }
    })
  }
  return {
    tooltipKeys : {
      name: name || 'name',
      id: id || 'id',
      nameAccessor: nameAccessor || dataPropertyAccessor,
      idAccessor: idAccessor || dataPropertyAccessor,
      metricKeys: metricKeysArray,
      metricAccessor: metricAccessor || dataPropertyAccessor,
      metricAliases,
    },
    formatData,
    formatTooltipTitle,
    formatPropertyLabel,
    tooltipProps,
  }
}

// ====[TODO] should we define also all geometry accessors for MVT layer?? Current solution is based on our MVT tegola files
/**
 * getObjectMVTData - gets all data attribute keys & values for a hovered MVT object
 * @param { object } param
 * @param { object } param.dataConfig - data configuration object for all map layers
 * @param { object } param.hoverInfo - object of onHover event
 * @returns { object } - object of data { key: value } pairs corresponding to an MVT object
 */
export const getObjectMVTData = ({ dataConfig, hoverInfo }) => {
  const { layer: { props: { dataId, geoKey, geometryAccessor } } } = hoverInfo
  const geo_id = hoverInfo.object.properties?.geo_id
  const tileData = dataConfig?.find(data => data.id === dataId)?.data?.tileData
  return tileData?.find(d => geometryAccessor(d)[geoKey] === geo_id) || {}
}
