// https://deck.gl/docs/api-reference/layers/geojson-layer

import { GeoJsonLayer } from 'deck.gl'

const defaultProps = {
  id: 'geojson-layer',
  pickable: true,
  stroked: true,
  visible: true,
  filled: true,
  extruded: false,
  lineWidthScale: 1,
  lineWidthMinPixels: 2,
  getFillColor: [225, 0, 0, 200],
  opacity: 0.5,
  getRadius: d => d.properties.radius,
  getLineWidth: 1,
  getElevation: 0,
  pointRadiusMaxPixels: 10000,
  pointRadiusScale: 1
}

/**
 * POIGeoJson - sets the poi icon layer
 * @param { object } props - props for GeoJsonLayer
 * @returns { instanceOf GeoJsonLayer } 
 */
const POIGeoJson = (props) =>
  new GeoJsonLayer({ 
    ...props,
    ...defaultProps
  })

export default POIGeoJson
  