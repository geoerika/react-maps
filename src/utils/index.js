import { extent } from 'd3-array'
import circle from '@turf/circle'


/**
 * getDataRange - returns array of min and max values of a data set
 * @param { object } param
 * @param { array } param.data - data array
 * @param { string } param.dataKey - data attribute key
 * @param { function } param.dataPropertyAccessor - function to access data attribute
 * @return { array  } - array of min and max values
 */
export const getDataRange = ({ data, dataKey, dataPropertyAccessor }) => {
  if (data?.length) {
    let [min, max] = extent(data, d => dataPropertyAccessor(d)[dataKey])
    if (min === max && max !== 0) {
      [min, max] = [Math.min(0, min), Math.max(0, max)]
    }
    return [min, max]
  }
  return []
}

/**
 * createCircleFromPointRadius - creates a circle / polygon GeoJSON feature from a radius and a set
 *                               of coordinates
 * @param { object } param
 * @param { array } param.centre - array of coordinates for circle centroid [lon, lat]
 * @param { number } param.radius - radius value
 * @return { object } - GeoJSON object of created circle / polygon
 */
export const createCircleFromPointRadius = ({ centre, radius }) => {
  // ToDo: research how large our radius can get and if can make a formula to set better step number
  const options = { steps: radius < 500 ? 50 : 100, units: 'meters' }
  let createdCircle = circle(centre, radius, options)
  createdCircle.properties.polygon_json = JSON.stringify(createdCircle.geometry)
  createdCircle.properties.poiType = 1
  return createdCircle
}

/**
 * getCursor - sets cursor for different layers and hover state
 * @param { object } params
 * @param { array } param.layers - current array of layers used in map
 * @return { function } - cursor function
 */
export const getCursor = ({ layers } = {}) => {
  if (layers?.length) {
    const drawLayer = layers.find(layer => {
      return layer.id === 'edit-draw layer' || layer.id.includes('select')})
    if (drawLayer?.props?.visible) {
      return drawLayer.getCursor.bind(drawLayer)
    }
  }
  return ({ isDragging, isHovering }) => (isDragging ? 'grabbing' : (isHovering ? 'pointer' : 'grab'))
}
