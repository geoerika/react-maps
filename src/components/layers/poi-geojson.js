// https://deck.gl/docs/api-reference/layers/geojson-layer

import { GeoJsonLayer } from 'deck.gl'
import {
  TYPE_RADIUS,
  POI_FILL_COLOUR,
  POI_LINE_COLOUR,
  POI_LINE_WIDTH,
  POI_OPACITY,
} from '../../constants'


const defaultProps = {
  id: 'geojson-layer',
  pickable: true,
  stroked: true,
  visible: true,
  filled: true,
  extruded: false,
  lineWidthScale: 1,
  lineWidthMinPixels: 0,
  lineWidthUnits: 'pixels',
  getFillColor: POI_FILL_COLOUR,
  getLineColor: POI_LINE_COLOUR,
  opacity: POI_OPACITY,
  getLineWidth: POI_LINE_WIDTH,
  getElevation: 0,
  pointRadiusScale: 1,
  transitions: {
    getPositions: 600,
    getRadius: {
      type: 'spring',
      stiffness: 0.01,
      damping: 0.15,
      enter: () => [0] // grow from size 0
    }
  }
}

/**
 * POIGeoJson - sets the POI icon layer
 * @param { object } props - props for GeoJsonLayer
 * @returns { instanceOf GeoJsonLayer } 
 */
const POIGeoJson = (props) =>
  new GeoJsonLayer({
    ...defaultProps,
    getRadius: d => {
      if (props.POIType === TYPE_RADIUS.code) {
        return d.properties.radius
      }
    },
    ...props,
  })

export default POIGeoJson
  