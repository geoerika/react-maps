import { WebMercatorViewport } from 'deck.gl'
import * as eqMapLayers from '../../components/layers/index'
import circle from '@turf/circle'
import  { point } from '@turf/helpers'
import tCentroid from '@turf/centroid'
import tBBox from '@turf/bbox'
import tDistance from '@turf/distance'

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
  const dataIsOnePoint = (data.length === 1 && data[0].geometry.type === 'Point')
  let viewData = data
  let padding = 25
  // set padding larger when we edit one POI
  if (data.length === 1) {
    padding = 50
  }
  if (dataIsOnePoint && data[0].properties.radius) {
    /** if data is one point POI with radius, we create a circle feature around the POI with the
     * radius of the point, which we use to determine the right zoom that would fit the radius in
     * the map view
     */
    const pointCoord = data[0].geometry.coordinates
    const pointRadius = data[0].properties.radius
    viewData= [createCircleFromPointRadius(pointCoord, pointRadius)]
  }
  const formattedGeoData = getDataCoordinates(viewData)
  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding: padding })
  let { longitude, latitude, zoom } = viewPort
  if (dataIsOnePoint && !data[0].properties.radius) {
    // default zoom for one point POI with no radius
    zoom = 16
  }
  return { longitude, latitude, zoom }
}

/**
 * processLayers - choses a layer based on type parameter
 * @param { array } layerArray - array of layers to show on map
 * @param { object } props - layers' props
 * @returns { instanceOf } Deck.gl layer
 */
export const processLayers = (layerArray, props) => {
  return layerArray.map(layer => layer === 'POICluster' 
    ? new eqMapLayers[layer](props)
    : eqMapLayers[layer](props))
}

/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { array } data - location data array
 * @returns { array } coordinates that define the boundary area where the data is located
 */
export const getDataCoordinates = (data) => {
  let finalCoordinateArray

  if (data[0]?.properties?.polygon_json) {
    finalCoordinateArray = data.reduce((acc, point) =>
      [...acc, JSON.parse(point.properties.polygon_json).coordinates[0]], []).flat()
  } else {
    finalCoordinateArray = data
  }

  const [minCoords, maxCoords] = finalCoordinateArray.reduce(
    ([[minLng, minLat], [maxLng, maxLat]], point) => {
      const [lng, lat] = point.geometry ? point.geometry.coordinates
        : point.lon ? [point.lon, point.lat]
          : point
      return [
        [Math.min(minLng, lng), Math.min(minLat, lat)],
        [Math.max(maxLng, lng), Math.max(maxLat, lat)]
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
  if (layers.length) {
    const drawLayer = layers.find(layer => layer.id === 'edit-draw layer')
    if (drawLayer) {
      return drawLayer.getCursor.bind(drawLayer)
    }
  }
  return ({isDragging}) => (isDragging ? 'grabbing' : (hoverInfo?.isHovering ? 'pointer' : 'grab'))
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
  const options = { steps: 50, units: 'meters' }
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
