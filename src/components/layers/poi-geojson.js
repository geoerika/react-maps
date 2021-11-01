// https://deck.gl/docs/api-reference/layers/geojson-layer

import { GeoJsonLayer } from '@deck.gl/layers'
import { TYPE_RADIUS } from '../../constants'


const defaultProps = {
  id: 'geojson-layer',
  stroked: true,
  visible: false,
  filled: true,
  extruded: false,
  lineWidthScale: 1,
  lineWidthMinPixels: 0,
  lineWidthUnits: 'pixels',
  getElevation: 0,
  parameters: {
    depthTest: false,
  },
  pointRadiusScale: 1,
  transitions: {
    getPositions: 600,
    getRadius: {
      type: 'spring',
      stiffness: 0.01,
      damping: 0.15,
      enter: () => [0], // grow from size 0
    },
  },
}

/**
 * POIGeoJson - sets the POI icon layer
 * @param { object } param - props for GeoJsonLayer
 * @param { object } param.mapProps - object of map properties
 * @param { array } param.data - data array
 * @param { number } param.POIType - POI type
 * @returns { instanceOf GeoJsonLayer } 
 */
const POIGeoJson = ({ data, mapProps, POIType, visible, ...props }) => {
  const {
    fillColour,
    polygonFillColour,
    lineColour,
    polygonLineColour,
    lineWidth,
    opacity,
  } = mapProps

  return new GeoJsonLayer({
    data,
    ...defaultProps,
    getRadius: d => {
      if (POIType === TYPE_RADIUS.code) {
        return d.properties.radius
      }
      return null
    },
    getFillColor: () => {
      if (POIType === TYPE_RADIUS.code) {
        return fillColour
      }
      return polygonFillColour
    },
    getLineColor: () => {
      if (POIType === TYPE_RADIUS.code) {
        return lineColour
      }
      return polygonLineColour
    },
    getLineWidth: () => lineWidth,
    updateTriggers: {
      getRadius: [POIType, data],
      getFillColor: [POIType, fillColour, polygonFillColour],
      getLineColor: [POIType, lineColour, polygonLineColour],
      getLineWidth: lineWidth,
    },
    opacity,
    transitions: data.length === 1 ? { ...defaultProps.transitions } : {},
    visible,
    pickable: visible,
    ...props,
  })
}

export default POIGeoJson
