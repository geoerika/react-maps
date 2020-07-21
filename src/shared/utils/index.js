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
 * getCoordinateArray - gets all longitude or latitude coordinates in one array
 * @param { array } data - location data array
 * @param { number } index - index in the nested array, 0 for longitude, 1 for latitude
 * @returns { array } array of all specific coordinates (longitude or latitude) from the data array
 */
const getCoordinateArray = (data, index) => 
  data.map((poi) =>
    poi.geometry
      ? poi.geometry.coordinates[index]
      : poi[index])

/**
 * getDataCoordinates - gets the coordinates that enclose all location data, including polygons
 * @param { array } data - location data array
 * @returns { array array } coordinates that define the boundary area where the data is located
 */
export const getDataCoordinates = (data) => {
  let finalCoordinateArray

  if (data[0].properties.polygon) {
    finalCoordinateArray = data.reduce((acc, poi) =>
      [...acc, JSON.parse(poi.properties.polygon_json.split(':')[2].split('}')[0])[0]], []).flat()
  } else {
    finalCoordinateArray = data
  }
  const lngArray = getCoordinateArray(finalCoordinateArray, 0)
  const latArray = getCoordinateArray(finalCoordinateArray, 1)

  const minCoords = [Math.min(...lngArray), Math.min(...latArray)];
  const maxCoords = [Math.max(...lngArray), Math.max(...latArray)];

  return [ minCoords, maxCoords ]
}
