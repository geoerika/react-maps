import { WebMercatorViewport } from '@deck.gl/core'

import { createCircleFromPointRadius } from './index'
import { GEOJSON_TYPES } from '../constants'


/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @param { object } param
 * @param { array } param.data - data to display on the map
 * @param { number } param.width - deck container width
 * @param { number } param.height - deck container height
 * @return { object } { latitude, longitude, zoom } - lat, long, and zoom for new viewState
 */
export const setView = ({ data, width, height }) => {
  let viewData = data

  // for lists <100 radii, set viewport to fit radius for all POIs
  if (data[0]?.geometry?.type === GEOJSON_TYPES.point && data?.length < 100) {
    viewData = []
    data.forEach(point => {
      if (point?.properties?.radius) {
        const pointCoord = point.geometry.coordinates
        const pointRadius = point.properties.radius
        viewData.push(createCircleFromPointRadius({ centre: pointCoord, radius: pointRadius }))
      } else {
        // cover case for a POI without a radius
        viewData.push(point)
      }
    })
  }

  const formattedGeoData = getDataCoordinates({ data: viewData })
  const dataLonDiff = formattedGeoData[0][0] - formattedGeoData[1][0]

  /**
   * -120 is the diff in longitude between the westernmost and easternmost points of
   * North America: (-172 - (-52)) = -120
   * Compare to the diff in longitude between westernmost point of NA and easternmost point of
   * Australia: -172 - (+153) = -325
   * Because we deal with a pitch, the distortion in map requires more padding between so extreme
   * points. We also need to reduce padding with map container shrinking size,
   * otherwise fitBounds breaks when padding is greater than map dimensions.
   */
  let padding = Math.min(width, height) / 4
  if (dataLonDiff > -120) {
    padding = Math.min(width, height) / 10
  } else if (Math.min(width, height) / 2 > 75) {
    padding =  75
  }

  // set padding larger when we edit one radii POI
  if (data.length === 1 && !data[0].properties?.polygon) {
    padding = Math.min(width, height) / 8
  }

  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding })

  let { longitude, latitude, zoom } = viewPort

  // set a lower value zoom for a point with small or inexistent radius to have better map perspective
  if (data?.length === 1 && data[0].geometry?.type === GEOJSON_TYPES.point &&
      (!data[0].properties?.radius || data[0].properties?.radius < 10)) {
    zoom = Math.min(zoom, 18)
  }

  return { longitude, latitude, zoom }
}

/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { object } param
 * @param { array } param.data - location data array
 * @returns { array } - coordinates that define the boundary area where the data is located
 */
export const getDataCoordinates = ({ data }) => {
  let coordinateArray
  if (data[0]?.geometry?.type) {
    coordinateArray = data.reduce((acc, point) => {
      const POIType = point.geometry?.type
      if (POIType === GEOJSON_TYPES.point) {
        return [...acc, point.geometry.coordinates]
      }
      if (POIType === GEOJSON_TYPES.polygon) {
        return [...acc, ...point.geometry.coordinates?.flat()]
      }
      if (POIType === GEOJSON_TYPES.multipolygon) {
        return [...acc, ...point.geometry.coordinates?.flat().flat()]
      }
    }, [])
  } else {
    coordinateArray = data.reduce((acc, point) => [...acc, [point?.lon, point?.lat]], [])
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
