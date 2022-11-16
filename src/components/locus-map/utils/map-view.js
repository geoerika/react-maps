import { WebMercatorViewport } from '@deck.gl/core'

import { GEOJSON_TYPES } from '../../../constants'


/**
 * getBoundBoxCoordFromArray - calculates the bounding box coordinates of an array of [lon, lat] elements
 * @param { array } array - array of [lon, lat] elements
 * @returns { array } [[minLng, minLat], [maxLng, maxLat]] - the bounding box coordinates of a
 *                                                           collection of coordinates
 */
const getBoundBoxCoordFromArray = (array) => array.reduce(
  ([[minLng, minLat], [maxLng, maxLat]], coords) => {
    const [lng, lat] = coords
    return [
      [Math.min(minLng, lng), Math.min(minLat, lat)],
      [Math.max(maxLng, lng), Math.max(maxLat, lat)],
    ]
  }, [[180, 90], [-180, -90]])

/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @param { object } param
 * @param { array } param.dataGeomList - array of data arrays and associated geometry to display on the map
 * @param { number } param.width - deck container width
 * @param { number } param.height - deck container height
 * @param { bool } param.haveArcLayer - whether an arc layer is part of the map
 * @returns { object } { latitude, longitude, zoom } - lat, long, and zoom for new viewState
 */
export const setView = ({ dataGeomList, width, height, haveArcLayer }) => {
  const dataCoordinateArray = dataGeomList?.map(({ data, longitude, latitude, geometryAccessor = d => d }) =>
    getDataCoordinates({ data, longitude, latitude, geometryAccessor })).flat()

  let adjustForArcLayerZoom = false
  if (haveArcLayer && dataGeomList?.every(({ data }) => data?.length < 5)) {
    adjustForArcLayerZoom = true
  }

  const formattedGeoData = dataCoordinateArray?.length ?
    getBoundBoxCoordFromArray(dataCoordinateArray) :
    []

  const dataLonDiff = formattedGeoData[0]?.[0] - formattedGeoData[1]?.[0]
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

  const validFormattedGeoData = [formattedGeoData[0]?.[0], formattedGeoData[1]?.[0]]
    .every(coord => coord >= -180 && coord <= 180) &&
    [formattedGeoData[0]?.[1], formattedGeoData[1]?.[1]]
      .every(coord => coord >= 0 && coord <= 90)

  const viewPort = validFormattedGeoData ?
    new WebMercatorViewport({ width, height })
      .fitBounds(formattedGeoData, { padding }) :
    {}

  let { longitude, latitude, zoom } = viewPort

  return { longitude, latitude, zoom: adjustForArcLayerZoom ? zoom - 1.8 : zoom }
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
  /**
   * TEMP, will change logic in widget-studio: if lat & lon in data, it means we have a mixed data
   * type for geom (ex: scatterplot & polygons) & will give priority to geom outside GEOJson format
   * until we solve in Widget Studio data source to come in an object instead of a list
   */
  if (data[0]?.geometry?.type && !(longitude && latitude)) {
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
  } else if (longitude && latitude) {
    coordinateArray = data.reduce((acc, item) =>
      [...acc, [geometryAccessor(item)?.[longitude], geometryAccessor(item)?.[latitude]]], [])
  }

  const [minCoords, maxCoords] = coordinateArray.length ?
    getBoundBoxCoordFromArray(coordinateArray) :
    []

  return [ minCoords, maxCoords ]
}
