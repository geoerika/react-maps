import { WebMercatorViewport } from '@deck.gl/core'
import { DrawCircleByDiameterMode, DrawRectangleMode, DrawPolygonMode } from '@nebula.gl/edit-modes'

import { setFinalLayerDataProperty } from '../../shared/utils'
import { PROP_CONFIGURATIONS, LAYER_CONFIGURATIONS } from './constants'


export const parseDeckGLLayerFromConfig = ({
  id,
  layer,
  geometry,
  visualizations,
  interactions,
  ...others
}) => {
  const {
    geometry: layerGeom,
    deckGLClass: Layer,
    defaultProps,
    visualizations: layerVisualizations,
  } = LAYER_CONFIGURATIONS[layer]

  const { layerMode } = others
  const dataPropertyAccessor = others?.dataPropertyAccessor || LAYER_CONFIGURATIONS[layer]?.dataPropertyAccessor
  const geometryAccessor = others?.geometry?.geometryAccessor
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

  // ====[TODO] correct fallback logic for the above. Should throw an error or prompt someone to choose

  // ====[TODO] calculate field extents in advance, so every configurable aspect doesn't need to
  const propsWithData = ({ data, highlightId }) => ({
    // ====[TODO] trim invalid visualization values for a given layer
    // =========] and provide the defaults from PROP_CONFIG
    ...layerVisualizations.reduce((agg, name) => {
      const config = visualizations[name] || {}
      const { deckGLName, defaultValue, byProducts = {} } = PROP_CONFIGURATIONS[name]
      return {
        ...agg,
        [deckGLName]: setFinalLayerDataProperty({
          ...config,
          data,
          defaultValue,
          dataPropertyAccessor,
          highlightId,
        }),
        ...byProducts,
      }
    }, {}),
  })

  const { click, hover, tooltip, highlight, labels } = interactions

  return data => new Layer({
    id,
    data: layer === 'MVT' ?
      data.tileGeom :
      (layer === 'select' ? { type: 'FeatureCollection', features: data } : data),
    // ====[TODO] logic for below
    // updateTriggers
    mode,
    visualizations,
    interactions,
    dataPropertyAccessor,
    ...defaultProps,
    ...others,
    ...propsWithData({ data }),
    ...geometryProps,
    pickable: click || hover || tooltip || highlight || labels,
    onEdit: layer !== 'select' ?
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
  })
}

/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @param { object } param
 * @param { array } param.dataGeomList - array of data arrays and associated geometry to display on the map
 * @param { number } param.width - deck container width
 * @param { number } param.height - deck container height
 * @return { object } { latitude, longitude, zoom } - lat, long, and zoom for new viewState
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
  const padding = dataLonDiff > -120 ?
    Math.min(width, height) / 10 :
    Math.min(width, height) / 2 > 75 ?
      75 :
      Math.min(width, height) / 4

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
    coordinateArray = data.reduce((acc, point) => [...acc, point?.geometry?.coordinates], [])
  } else {
    coordinateArray = data.reduce((acc, point) =>
      [...acc, [geometryAccessor(point)?.[longitude], geometryAccessor(point)?.[latitude]]], [])
  }
  if (POIType === 'Polygon') {
    coordinateArray = coordinateArray.flat().flat()
  }
  if (POIType === 'MultiPolygon') {
    coordinateArray = coordinateArray.flat().flat().flat()
  }
  const [minCoords, maxCoords] = coordinateArray.reduce(
    ([[minLng, minLat], [maxLng, maxLat]], point) => {
      const [lng, lat] = point
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
  } = layerProps
  const { tooltipKeys, formatTooltipTitle, tooltipProps } = layerProps?.interactions?.tooltip
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
  const { layer: { props: { dataId, dataPropertyAccessor } } } = hoverInfo
  const geo_id = hoverInfo.object.properties.geo_id
  const tileData = dataConfig.find(data => data.id === dataId)?.data?.tileData
  return tileData.find(d => dataPropertyAccessor(d).geo_id === geo_id)
}
