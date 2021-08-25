import { WebMercatorViewport } from '@deck.gl/core'
import * as eqMapLayers from '../../components/layers'

import circle from '@turf/circle'
import { point } from '@turf/helpers'
import tCentroid from '@turf/centroid'
import tBBox from '@turf/bbox'
import tDistance from '@turf/distance'
import { SCALES } from '../../constants'
import { color } from 'd3-color'


/**
 * processLayers - returns layers used by a map
 * @param { object } param
 * @param { array } param.mapLayers - array of layers to show on map
 * @param { array } param.layerPool - array of all layers used by map in general
 * @param { object } param.props - layers' props
 * @returns { array } - array of Deck.gl and Nebula.gl layers used by a map
 */
export const processLayers = ({ mapLayers, layerPool, props }) =>
  layerPool.map(layer =>
    mapLayers.includes(layer) ?
      setLayer({ layer, props, visible: true }) :
      setLayer({ layer, props, visible: false }),
  )

/**
 * setLayer - sets a map layer
 * @param { object } param
 * @param { string } param.layer - name of a layer found in src/components/layers/index.js
 * @param { object } param.props - object of layer props
 * @param { boolean } param.visible - boolean to be used to set a certain layer visible or not on the map
 * @returns { instanceOf } - Deck.gl or Nebula.gl layer
 */
const setLayer = ({ layer, props, visible }) =>
  layer === 'POICluster' ?
    new eqMapLayers[layer]({ ...props, visible }) :
    eqMapLayers[layer]({ ...props, visible })

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
  if (data[0]?.geometry?.type === 'Point' && data?.length < 100) {
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

  // set a lower value zoom for a point with small or inexistent radius to have better map perspective
  if (data?.length === 1 && data[0].geometry?.type === 'Point' &&
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
  let POIType
  let coordinateArray
  if (data[0]?.geometry?.type) {
    coordinateArray = data.reduce((acc, point) => {
      POIType = point.geometry?.type
      if (POIType === 'Point') {
        return [...acc, point.geometry.coordinates]
      }
      if (POIType === 'Polygon') {
        return [...acc, ...point.geometry.coordinates?.flat()]
      }
      if (POIType === 'MultiPolygon') {
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
 * getCircleRadiusCentroid - calculates the radius and centroid of a circle / polygon
 * @param { object } polygon - GeoJSON polygon object
 * @return { object } - the values of the circle's radius and centroid coordinates
 */
export const getCircleRadiusCentroid = ({ polygon }) => {
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

/**
 * setFinalLayerDataAccsessor - returns function or values to set deck.gl layer property (ex: fill colour, radius)
 * @param { object } param
 * @param { string } param.dataKey - data attribute key
 * @param { function || number || array } param.getLayerProp - deck.gl layer data accessor
 * @param { function } param.layerDataScale - D3 scale function
 * @param { array } param.layerPropRange - array of range values for the deck.gl layer property
 * @param { object } param.metrics - object of {max, min} values of all data attribute keys
 * @param { function } param.dataPropertyAccessor - function to help access attribute data
 * @return { function || number || array  } - final function/number/array for deck.gl layer data accessor
 */
export const setFinalLayerDataAccessor = ({
  dataKey,
  getLayerProp,
  layerDataScale,
  layerPropRange,
  metrics,
  dataPropertyAccessor = d => d,
  highlightId = null,
}) => {
  if (dataKey?.length) {
    if (metrics[dataKey]?.max) {
      const d3Fn = SCALES[layerDataScale]([
        (metrics[dataKey] || { min: 0 }).min,
        (metrics[dataKey] || { max: 10 }).max,
      ], layerPropRange)
      return (d) => d3Fn(dataPropertyAccessor(d)[dataKey])
    }
    return layerPropRange[0]
  }
  return typeof getLayerProp === 'function' ? getLayerProp(highlightId) : getLayerProp
}

/**
 * strToArrayColor - transforms a string format color ex.'#0062d9' into an array of rgb color values
 * @param { object } param
 * @param { string } param.strColor - string format color
 * @returns { array  } - an array of rgb color values [r, g, b]
 */
export const strToArrayColor = ({ strColor }) => {
  const layerColor = color(strColor)
  return [layerColor.r, layerColor.g, layerColor.b]
}

/**
 * getArrayFillColors - converts an array of string format colour in array format
 * @param { object } param
 * @param { string } param.fillColors - array of string format colours ['#0062d9', '#dd196b']
 * @returns { array } - array format colour [[r, g, b]]
 */
export const getArrayFillColors = ({ fillColors }) =>
  fillColors.map((strColor) => {
    return strToArrayColor({ strColor })
  })

/**
* getStrFillColor - converts an array format colour [r, g, b] in a string format colour
* @param { object } param
* @param { array || function } param.getFillColor - function or array of Deck.gl layer fill colours
* @param { string } param.opacity - opacity value
* @returns { array } - string format colour 'rgb(r, g, b, opacity)'
*/
export const getStrFillColor = ({ fillColor, opacity }) => {
  const color = typeof fillColor === 'function' ? fillColor(0)(1) : fillColor
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
}

/**
* getArrayGradientFillColors - converts an array of string format colours ex. ["#0062d9", "#dd196b"]
* in an array of rgba string format colours
* @param { object } param
* @param { string } param.fillColors - array of string format colours ['#0062d9', '#dd196b']
* * @param { string } param.opacity - opacity value
* @returns { array } - array of rgba string format colours ['rgb(r, g, b, opacity)']
*/
export const getArrayGradientFillColors = ({ fillColors, opacity }) =>
  fillColors.map(strColor => {
    const arrayColor = strToArrayColor({ strColor })
    return `rgba(${arrayColor[0]}, ${arrayColor[1]}, ${arrayColor[2]}, ${opacity})`
  })

/**
 * setLegendOpacity - adjusts legend opacity to match closer to deck.gl layer opacity
 * @param { object } param
 * @param { number } param.opacity - map opacity value
 * @returns { number  } - legend opacity value
 */
export const setLegendOpacity = ({ opacity }) =>
  opacity >= 1 ? 1 : (opacity > 0.6 ? 0.9 : opacity + 0.2)
