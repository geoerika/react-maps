import { WebMercatorViewport } from '@deck.gl/core'
import * as eqMapLayers from '../../components/layers'

import circle from '@turf/circle'
import { point } from '@turf/helpers'
import tCentroid from '@turf/centroid'
import tBBox from '@turf/bbox'
import tDistance from '@turf/distance'

import { TYPE_RADIUS } from '../../constants'


/**
 * processLayers - returns layers used by a map
 * @param { array } mapLayers - array of layers to show on map
 * @param { array } layerPool - array of all layers used by map in general
 * @param { object } props - layers' props
 * @returns { array } - array of Deck.gl and Nebula.gl layers used by a map
 */
export const processLayers = (mapLayers, layerPool, props) =>
  layerPool.map(layer =>
    mapLayers.includes(layer) ?
      setLayer(layer, props, true) :
      setLayer(layer, props, false),
  )

/**
 * setLayer - sets a map layer
 * @param { string } layer - name of a layer found in src/components/layers/index.js
 * @param { object } props - object of layer props
 * @param { boolean } visible - boolean to be used to set a certain layer visible or not on the map
 * @returns { instanceOf } - Deck.gl or Nebula.gl layer
 */
const setLayer = (layer, props, visible) =>
  layer === 'POICluster' ?
    new eqMapLayers[layer]({ ...props, visible }) :
    eqMapLayers[layer]({ ...props, visible })

/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @param { object } param
 * @param { array } param.data - data to display on the map
 * @param { boolean } param.showRadius - to display or not POI radius
 * @param { number } param.width - deck container width
 * @param { number } param.height - deck container height
 * @return { object } { latitude, longitude, zoom } - lat, long, and zoom for new viewState
 */
export const setView = ({ data, width, height }) => {
  let viewData = data

  // for lists <100 radii, set viewport to fit radius for all POIs
  if (data[0]?.properties?.poiType === TYPE_RADIUS.code && data?.length < 100) {
    viewData = []
    data.forEach(point => {
      if (point?.properties?.radius) {
        const pointCoord = point.geometry.coordinates
        const pointRadius = point.properties.radius
        viewData.push(createCircleFromPointRadius(pointCoord, pointRadius))
      } else {
        // cover case for a POI without a radius
        viewData.push(point)
      }
    })
  }

  const formattedGeoData = getDataCoordinates(viewData)
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
  let padding = dataLonDiff > -120 ?
    Math.min(width, height) / 10 :
    Math.min(width, height) / 2 > 75 ?
      75 :
      Math.min(width, height) / 4

  // set padding larger when we edit one radii POI
  if (data.length === 1 && !data[0].properties?.polygon) {
    padding = Math.min(width, height) / 8
  }

  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding })

  let { longitude, latitude, zoom } = viewPort

  return { longitude, latitude, zoom }
}

/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { array } data - location data array
 * @returns { array } - coordinates that define the boundary area where the data is located
 */
export const getDataCoordinates = (data) => {
  let POIType
  let coordinateArray
  if (data[0]?.geometry?.type) {
    POIType = data[0]?.geometry?.type
    coordinateArray = data.reduce((acc, point) => [...acc, point?.geometry?.coordinates], [])
  } else {
    coordinateArray = data.reduce((acc, point) => [...acc, [point?.lon, point?.lat]], [])
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
 * getCursor - sets cursor for different layers and hover state
 * @param { object } param
 * @param { array } param.layers - current array of layers used in map
 * @param { object } param.hoverInfo - object supplied by onHover event
 * @return { function } - cursor function
 */
export const getCursor = ({ layers, hoverInfo }) => {
  if (layers?.length) {
    const drawLayer = layers.find(layer => layer.id === 'edit-draw layer')
    if (drawLayer?.props?.visible) {
      return drawLayer.getCursor.bind(drawLayer)
    }
  }
  return ({ isDragging }) => (isDragging ? 'grabbing' : (hoverInfo?.isHovering ? 'pointer' : 'grab'))
}

/**
 * createCircleFromPointRadius - creates a circle / polygon GeoJSON feature from a radius and a set
 *                               of coordinates
 * @param { array } centre - array of coordinates for circle centroid [lon, lat]
 * @param { number } radius - radius value
 * @return { object } - GeoJSON object of created circle / polygon
 */
export const createCircleFromPointRadius = (centre, radius) => {
  // ToDo: research how large our radius can get and if can make a formula to set better step number
  const options = { steps: radius < 500 ? 50 : 100, units: 'meters' }
  let createdCircle = circle(centre, radius, options)
  createdCircle.properties.polygon_json = JSON.stringify(createdCircle.geometry)
  createdCircle.properties.poiType = 1
  return createdCircle
}

/**
 * getCircleRadiusCentroid - calculates the radius and centroid of a circle / polygon
 * @param { object } polygon - GeoJSON polygon object
 * @return { object } - the values of the circle's radius and centroid coordinates
 */
export const getCircleRadiusCentroid = (polygon) => {
  polygon = {
    ...polygon,
    type: 'Feature',
  }
  const centroid = tCentroid(polygon)
  const bound = tBBox(polygon)
  let radius = tDistance(centroid, point(([(bound[0] + bound[2]) / 2, bound[3]])))
  // return radius in meters
  let coordinates = centroid.geometry.coordinates
  radius = Math.round(radius * 1000000) / 1000
  return { radius, coordinates }
}
