import { WebMercatorViewport } from 'deck.gl'
import * as eqMapLayers from '../../components/layers/index'

/**
 * setView - handles calculations of viewState lat, long, and zoom, based on
 *           data coordinates and deck size
 * @return { latitude, longitude, zoom } - lat, long, and zoom for new viewState
 */
export const setView = ({data, width, height}) => {
  const formattedGeoData = getDataCoordinates(data)
  const viewPort = new WebMercatorViewport({ width, height })
    .fitBounds(formattedGeoData, { padding: 25 })
  const { latitude, longitude, zoom } = viewPort
  return { latitude, longitude, zoom }
}

/**
 * processLayers - choses a layer based on type parameter
 * @param { array } layerArray - array of layers to show on map
 * @param { object } props - layers' props
 * @returns { instanceOf } Deck.gl layer
 */
export const processLayers = (layerArray, props) => {
  return layerArray.map(layer => layer === 'cluster' 
    ? new eqMapLayers[layer](props)
    : eqMapLayers[layer](props))
}

/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { array } data - location data array
 * @returns { array array } coordinates that define the boundary area where the data is located
 */
export const getDataCoordinates = (data) => {
  let finalCoordinateArray

  if (data[0].properties.polygon) {
    finalCoordinateArray = data.reduce((acc, poi) =>
      [...acc, JSON.parse(poi.properties.polygon_json).coordinates[0]], []).flat()
  } else {
    finalCoordinateArray = data
  }

  const [minCoords, maxCoords] = finalCoordinateArray.reduce(
    ([[minLng, minLat], [maxLng, maxLat]], poi) => {
      const [lng, lat] = poi.geometry
        ? poi.geometry.coordinates
        : poi
      return [
        [Math.min(minLng, lng), Math.min(minLat, lat)],
        [Math.max(maxLng, lng), Math.max(maxLat, lat)]
      ]
    }, [[180, 90], [-180, -90]])

  return [ minCoords, maxCoords ]
}

/**
* getCursor - sets cursor for drawing on a nebula drawing layer
* @param { array } layers - current array of layers used in map
* @return { function } - cursor function for nebula drawing layer
*/
export const getCursor = ({ layers, type }) => {
  if (layers.length && type === 'draw') {
    const drawLayer = layers.find(layer => layer.id === 'draw layer')
    if (drawLayer) {
      return drawLayer.getCursor.bind(drawLayer)
    }
  }
  return ({ isGrabbing }) => isGrabbing ? 'grabbing' : 'grab'
}
