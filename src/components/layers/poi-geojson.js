// https://deck.gl/docs/api-reference/layers/geojson-layer

import { GeoJsonLayer } from 'deck.gl'

const defaultProps = {
  id: 'geojson-layer',
  pickable: true,
  stroked: true,
  visible: true,
  filled: true,
  extruded: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 2,
  getFillColor: [225, 0, 0, 200],
  opacity: 0.8,
  getRadius: d => d.properties.radius,
  getLineWidth: 1,
  getElevation: 30,
  pointRadiusMaxPixels: 10000,
  pointRadiusScale: 1
}

/**
 * setPOIIcon - sets the poi icon layer
 * @param { array } data - poi data array
 * @param { boolean } stroked - whether to draw an outline around polygons (solid fill),to show radius also needs to be true
 * @param { number } lineWidthScale- line width multiplier that affects all lines, including radius outline
 * @param { number } lineWidthMinPixels - minimum line width in pixels.
 * @param { array } getFillColor - solid color of the polygon and point features, format is [r, g, b, [a]]
 * @param { function || number } getRadius - radius of Point and MultiPoint feature
 * @param { function || number } getLineWidth - width of line string and/or the outline of polygon 
 * @param { function || number } getElevation -  elevation of a polygon feature
 * @param { number } pointRadiusMaxPixels - maximum radius in pixels
 * @param { number } pointRadiusScale - global radius multiplier for all points
 * @returns { instanceOf GeoJsonLayer} 
 */
export const setGeoJsonLayer = (
  data,
  stroked,
  lineWidthScale,
  lineWidthMinPixels,
  getFillColor,
  opacity,
  getRadius,
  getLineWidth,
  getElevation,
  pointRadiusMaxPixels,
  pointRadiusScale
) => {
  return new GeoJsonLayer({ 
    data,
    stroked,
    lineWidthScale,
    lineWidthMinPixels,
    getFillColor,
    opacity,
    getRadius,
    getLineWidth,
    getElevation,
    pointRadiusMaxPixels,
    pointRadiusScale,
    ...defaultProps
  } );
}
  