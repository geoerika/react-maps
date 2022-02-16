import { ScatterplotLayer, GeoJsonLayer, ArcLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { EditableGeoJsonLayer } from '@nebula.gl/layers'


// ====[TODO] use individual hover events for each layer

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
    name: 'scatterplot',
    notAClass: false,
    deckGLClass: ScatterplotLayer,
    dataPropertyAccessor: d => d,
    geometry: {
      propName: 'getPosition',
      // ====[TODO] support [lon,lat] array?
      // =========] inv => d => inv ? [...d[coordKey]].reverse() : d[coordKey]
      propFn: ({ longitude, latitude, geometryAccessor = d => d }) => d =>
        [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
      longitude: { type: 'number' },
      latitude: { type: 'number' },
    },
    // validator: (d) => Array.isArray(d) && d.every(row => DEFAULT_GEOMETRY_KEYS.latitude.some(key => validKey(row[key], 'number')) && DEFAULT_GEOMETRY_KEYS.longitude.some(key => validKey(row[key], 'number'))),
    visualizations: ['radius', 'fill', 'lineWidth', 'lineColor'],
    interactions: ['click', 'hover', 'tooltip', 'highlight', 'labels'],
    defaultProps: {
      radiusUnits: 'pixels',
      lineWidthUnits: 'pixels',
    },
  },
  geojson: {
    name: 'geojson',
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
      lineWidthUnits: 'pixels',
      pointRadiusUnits: 'meters',
      parameters: {
        depthTest: false,
      },
      extruded: false,
    },
  },
  arc: {
    name: 'arc',
    notAClass: false,
    deckGLClass: ArcLayer,
    dataPropertyAccessor: d => d,
    geometry: {
      source: {
        propName: 'getSourcePosition',
        propFn: ({ longitude, latitude, geometryAccessor = d => d }) => d =>
          [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
        longitude: { type: 'number' },
        latitude: { type: 'number' },
      },
      target: {
        propName: 'getTargetPosition',
        propFn: ({ longitude, latitude, geometryAccessor = d => d }) => d =>
          [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
        longitude: { type: 'number' },
        latitude: { type: 'number' },
      },
    },
    visualizations: ['sourceArcColor', 'targetArcColor', 'arcWidth', 'arcHeight', 'arcTilt'],
    interactions: [],
    defaultProps: {},
  },
  MVT: {
    name: 'MVT',
    notAClass: false,
    deckGLClass: MVTLayer,
    dataPropertyAccessor: d => d,
    geometry: { geoKey: 'geo_id', geometryAccessor: d => d },
    visualizations: ['fill', 'lineWidth', 'lineColor'],
    interactions: ['click', 'hover', 'tooltip', 'highlight', 'labels'],
    defaultProps: {
      // extent: null, //[minX, minY, maxX, maxY]
      minZoom: 0,
      maxZoom: 23,
      lineWidthUnits: 'pixels',
    },
  },
  select: {
    name: 'select',
    notAClass: true,
    deckGLClass: EditableGeoJsonLayer,
    visualizations: [
      'fill',
      'lineWidth',
      'lineColor',
      'tentativeFillColor',
      'tentativeLineColor',
      'tentativeLineWidth',
      'editHandlePointColor',
      'editHandlePointOutlineColor',
      'editHandlePointRadius',
    ],
    interactions: [],
    defaultProps: {
      visible: true,
      pickingRadius: 12,
      _subLayerProps: {
        geojson: {
          parameters: {
            depthTest: false,
          },
        },
        guides: {
          parameters: {
            depthTest: false,
          },
        },
      },
    },
  },
}

// ====[NOTE] props that are available for configuration via UI
export const PROP_CONFIGURATIONS = {
  fill: {
    name: 'fill',
    defaultValue: {
      value: [54, 111, 228],
      valueOptions: [[214, 232, 253],[54, 111, 228]],
    },
    deckGLName: 'getFillColor',
    byProducts: { filled: true },
  },
  radius: {
    name: 'radius',
    defaultValue: {
      value: 10,
      valueOptions: [5, 15],
    },
    deckGLName: 'getRadius',
  },
  lineWidth: {
    name: 'lineWidth',
    defaultValue: 1,
    deckGLName: 'getLineWidth',
    byProducts: { stroked: true },
  },
  lineColor: {
    name: 'lineColor',
    defaultValue: [39, 85, 196],
    deckGLName: 'getLineColor',
    byProducts: { stroked: true },
  },
  elevation: {
    name: 'elevation',
    defaultValue: [0, 1000],
    deckGLName: 'getElevation',
    byProducts: {
      extruded: true,
      parameters: {
        depthTest: true,
      },
    },
  },
  sourceArcColor: {
    defaultValue: [54, 111, 228],
    deckGLName: 'getSourceColor',
    byProducts: { stroked: true },
  },
  targetArcColor: {
    defaultValue: [250, 175, 21],
    deckGLName: 'getTargetColor',
    byProducts: { stroked: true },
  },
  arcWidth: {
    name: 'arcWidth',
    defaultValue: 1,
    deckGLName: 'getWidth',
    byProducts: { stroked: true },
  },
  arcHeight: {
    name: 'arcHeight',
    defaultValue: 1,
    deckGLName: 'getHeight',
  },
  arcTilt: {
    name: 'arcTilt',
    defaultValue: 0,
    deckGLName: 'getTilt',
  },
  tentativeFillColor: {
    name: 'tentativeFillColor',
    defaultValue: [253, 217, 114],
    deckGLName: 'getTentativeFillColor',
  },
  tentativeLineColor: {
    name: 'tentativeLineColor',
    defaultValue: [215, 142, 15],
    deckGLName: 'getTentativeLineColor',
  },
  tentativeLineWidth: {
    name: 'tentativeLineWidth',
    defaultValue: 2,
    deckGLName: 'getTentativeLineWidth',
  },
  editHandlePointColor: {
    name: 'editHandlePointColor',
    defaultValue: [182, 38, 40],
    deckGLName: 'getEditHandlePointColor',
  },
  editHandlePointOutlineColor: {
    name: 'editHandlePointOutlineColor',
    defaultValue: [255, 255, 255],
    deckGLName: 'getEditHandlePointOutlineColor',
  },
  editHandlePointRadius: {
    name: 'editHandlePointRadius',
    defaultValue: 4,
    deckGLName: 'getEditHandlePointRadius',
  },
}
