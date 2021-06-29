import { ScatterplotLayer, GeoJsonLayer, ArcLayer } from '@deck.gl/layers'
// ====[TODO] extensions? https://deck.gl/docs/api-reference/extensions/data-filter-extension

/*
  ====[TODO] what about a COMBO layer?
  multi: true,
  layers: [
    {custom object},
    'name of layer',
  ]
*/

// ====[NOTE] default keys to check for when loading data
// const DEFAULT_GEOMETRY_KEYS = {
//   latitude: ['lat', 'latitude'],
//   longitude: ['lon', 'longitude'],
//   geojson: ['geojson'],
// }

// ====[TODO] better type-checking e.g. parseInt
// const validKey = (value, type) => value !== undefined && value !== null && typeof value === type

// ====[NOTE] consumed by UI to define how a user can interact with a given layer
export const LAYER_CONFIGURATIONS = {
  scatterplot: {
    notAClass: false,
    deckGLClass: ScatterplotLayer,
    geometry: {
      propName: 'getPosition',
      // ====[TODO] support [lon,lat] array?
      // =========] inv => d => inv ? [...d[coordKey]].reverse() : d[coordKey]
      propFn: ({ longitude, latitude, geometryAccessor }) => d =>
        [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
      longitude: { type: 'number' },
      latitude: { type: 'number' },
    },
    // validator: (d) => Array.isArray(d) && d.every(row => DEFAULT_GEOMETRY_KEYS.latitude.some(key => validKey(row[key], 'number')) && DEFAULT_GEOMETRY_KEYS.longitude.some(key => validKey(row[key], 'number'))),
    visualizations: ['radius', 'fill', 'lineWidth', 'lineColor'],
    interactions: ['click', 'hover', 'tooltip', 'highlight', 'labels'],
    defaultProps: {
      radiusScale: 1,
      radiusUnits: 'pixels',
      radiusMinPixels: 0,
      radiusMaxPixels: Number.MAX_SAFE_INTEGER,
      lineWidthScale: 1,
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 0,
      lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
    },
  },
  geojson: {
    notAClass: false,
    deckGLClass: GeoJsonLayer,
    dataPropertyAccessor: d => d.properties,
    geometry: {
      // ====[TODO] how to handle geojson field vs just geojson data
      geojson: { type: ['object', 'array'] },
    },
    // validator: (d) => Array.isArray(d) && d.every(row => hasGeoJson(row)),
    // ====[TODO] radius isn't always valid, so how do we turn it off?
    // =========] GeoJson is EITHER radius around geometry.coordinates OR just coordinates
    visualizations: ['radius', 'elevation', 'fill', 'lineWidth', 'lineColor'],
    interactions: ['click', 'hover', 'tooltip', 'highlight', 'labels'],
    defaultProps: {
      lineWidthScale: 1,
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 0,
      lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
      lineJointRounded: false,
      lineMiterLimit: 4,
      elevationScale: 1,
      pointRadiusScale: 1,
      pointRadiusUnits: 'meters',
      pointRadiusMinPixels: 0,
      pointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
      material: true,
    },
  },
  arc: {
    notAClass: false,
    deckGLClass: ArcLayer,
    geometry: {
      source: {
        propName: 'getSourcePosition',
        propFn: ({ longitude, latitude, geometryAccessor }) => d =>
          [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
        longitude: { type: 'number' },
        latitude: { type: 'number' },
      },
      target: {
        propName: 'getTargetPosition',
        propFn: ({ longitude, latitude, geometryAccessor }) => d =>
          [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
        longitude: { type: 'number' },
        latitude: { type: 'number' },
      },
    },
    visualizations: ['sourceArcColor', 'targetArcColor', 'arcWidth', 'arcHeight', 'arcTilt'],
    interactions: ['click', 'hover', 'tooltip', 'highlight', 'labels'],
    defaultProps: {
      greatCircle: false,
      widthMinPixels: 0,
      widthMaxPixels: Number.MAX_SAFE_INTEGER,
      widthScale: 1,
      widthUnits: 'pixels',
    },
  },
}

// ====[NOTE] props that are available for configuration via UI
export const PROP_CONFIGURATIONS = {
  fill: {
    defaultValue: highlightId => d => d?.GeoCohortItem === highlightId ? [255, 138, 0] : [0, 117, 255],
    deckGLName: 'getFillColor',
    byProducts: { filled: true },
  },
  radius: {
    defaultValue: 20,
    deckGLName: 'getRadius',
  },
  lineWidth: {
    defaultValue: 1,
    deckGLName: 'getLineWidth',
    byProducts: { stroked: true },
  },
  lineColor: {
    defaultValue: [0, 0, 0],
    deckGLName: 'getLineColor',
    byProducts: { stroked: true },
  },
  elevation: {
    defaultValue: 0,
    deckGLName: 'getElevation',
    byProducts: { extruded: true },
  },
  sourceArcColor: {
    defaultValue: [156,39, 176],
    deckGLName: 'getSourceColor',
  },
  targetArcColor: {
    defaultValue: [255, 235, 59],
    deckGLName: 'getTargetColor',
  },
  arcWidth: {
    defaultValue: 1,
    deckGLName: 'getWidth',
  },
  arcHeight: {
    defaultValue: 1,
    deckGLName: 'getHeight',
  },
  arcTilt: {
    defaultValue: 0,
    deckGLName: 'getTilt',
  },
}
