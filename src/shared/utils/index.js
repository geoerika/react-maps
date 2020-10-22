import { WebMercatorViewport } from 'deck.gl'
import * as eqMapLayers from '../../components/layers/index'

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
  const formattedGeoData = getDataCoordinates(data)
  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding: 25 })
  let { longitude, latitude, zoom } = viewPort
  // TODO: handle zoom better, search to see if can be set by radius
  if (data.length === 1 && data[0].geometry.type === 'Point') {
    // zoom set so poi-manage map can fit a radius of 200m
    zoom = 15
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

  if (data[0].properties?.polygon) {
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
    const drawLayer = layers.find(layer => layer.id === 'draw layer')
    if (drawLayer) {
      return drawLayer.getCursor.bind(drawLayer)
    }
  }
  return ({isDragging}) => (isDragging ? 'grabbing' : (hoverInfo?.isHovering ? 'pointer' : 'grab'))
}
