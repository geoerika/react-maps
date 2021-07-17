import { WebMercatorViewport } from '@deck.gl/core'

import { setFinalLayerDataProperty } from '../../shared/utils'
import { PROP_CONFIGURATIONS, LAYER_CONFIGURATIONS } from './constants'


export const parseDeckGLLayerFromConfig = ({
  id,
  layer,
  geometry,
  visualizations,
  // interactions,
  ...other
}) => {
  const {
    dataPropertyAccessor = d => d,
    geometryAccessor = d => d,
    geometry: layerGeom,
    deckGLClass: Layer,
    defaultProps,
    visualizations: layerVisualizations,
  } = LAYER_CONFIGURATIONS[layer]

  // ====[NOTE] if a layer requires explicit geometry (all except GeoJson?)
  // =========] pass its configured values (references to data fields) to final propFn
  let geometryProps = {}
  if (layerGeom.propName) {
    geometryProps = { [layerGeom.propName]: layerGeom.propFn({ geometryAccessor, ...geometry }) }
  }
  if(layerGeom.source) {
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

  return data => new Layer({
    id,
    data,
    // ====[TODO] logic for below
    // pickable
    // updateTriggers
    ...defaultProps,
    ...other,
    ...propsWithData({ data }),
    ...geometryProps,
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

  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding: 50 })

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
