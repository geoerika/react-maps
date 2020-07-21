import * as eqMapLayers from '../../components/layers/index'

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