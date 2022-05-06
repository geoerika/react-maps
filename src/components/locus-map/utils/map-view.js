import { WebMercatorViewport } from '@deck.gl/core'

import { GEOJSON_TYPES } from '../../../constants'


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
const getDataCoordinates = ({ data, geometryAccessor, longitude, latitude }) => {
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
