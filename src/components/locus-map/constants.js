import { ScatterplotLayer, GeoJsonLayer, ArcLayer, IconLayer, TextLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { EditableGeoJsonLayer } from '@nebula.gl/layers'

import { GEOJSON_TYPES } from '../../constants'
import POIIconMarker from '../../shared/icons/poi-location.png'


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
    interactions: ['click', 'hover', 'tooltip', 'highlight'],
    defaultProps: {
      radiusUnits: 'pixels',
      lineWidthUnits: 'pixels',
      sizeScale: 1,
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
    visualizations: ['pointRadius', 'elevation', 'fill', 'lineWidth', 'lineColor'],
    interactions: ['click', 'hover', 'tooltip', 'highlight'],
    defaultProps: {
      lineWidthUnits: 'pixels',
      pointRadiusUnits: 'meters',
      parameters: {
        depthTest: false,
      },
      extruded: false,
      sizeScale: 1,
    },
  },
  arc: {
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
  icon: {
    notAClass: false,
    deckGLClass: IconLayer,
    dataPropertyAccessor: d => d,
    geometry: {
      propName: 'getPosition',
      propFn: ({ longitude, latitude, geometryAccessor = d => d }) => d =>
        [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
      longitude: { type: 'number' },
      latitude: { type: 'number' },
    },
    visualizations: ['icon', 'size', 'color'],
    interactions: ['click', 'hover', 'tooltip', 'highlight'],
    defaultProps: {
      sizeScale: 4,
      iconAtlas: POIIconMarker,
      iconMapping:  { marker: { x: 0, y: 0, width: 128, height: 128, anchorY: 128, mask: true } },
      getSize: 4,
    },
  },
  MVT: {
    notAClass: false,
    deckGLClass: MVTLayer,
    dataPropertyAccessor: d => d,
    geometry: { geoKey: 'geo_id', geometryAccessor: d => d },
    visualizations: ['fill', 'lineWidth', 'lineColor'],
    interactions: ['click', 'hover', 'tooltip', 'highlight'],
    defaultProps: {
      // extent: null, //[minX, minY, maxX, maxY]
      minZoom: 0,
      maxZoom: 23,
      lineWidthUnits: 'pixels',
      sizeScale: 1,
    },
  },
  select: {
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
  text: {
    notAClass: false,
    deckGLClass: TextLayer,
    dataPropertyAccessor: d => d,
    geometry: {
      propName: 'getPosition',
      propFn: ({ longitude, latitude, geometryAccessor = d => d }) => d =>
        d.type === 'Feature' && d.geometry?.type === GEOJSON_TYPES.point ?
          d.geometry.coordinates :
          [geometryAccessor(d)[longitude], geometryAccessor(d)[latitude]],
      longitude: { type: 'number' },
      latitude: { type: 'number' },
    },
    visualizations: [
      'text',
      'size',
      'color',
      'angle',
      'anchor',
      'alignment',
      'pixelOffset',
      'backgroundPadding',
      'backgroundColor',
      'borderColor',
      'borderWidth',
    ],
    interactions: ['tooltip', 'hover', 'highlight'],
    defaultProps: {
      sizeScale: 1,
      fontFamily: '"Open Sans", sans-serif',
      background: true,
    },
  },
}

export const LAYER_TYPES = Object.keys(LAYER_CONFIGURATIONS).reduce((acc, curr) => {
  acc[curr] = curr
  return acc
}, {})

// ====[NOTE] props that are available for configuration via UI
export const PROP_CONFIGURATIONS = {
  fill: {
    deckGLName: 'getFillColor',
    defaultValue: {
      value: [54, 111, 228],
      valueOptions: [[214, 232, 253],[54, 111, 228]],
    },
    byProducts: { filled: true },
  },
  radius: {
    deckGLName: 'getRadius',
    defaultValue: {
      value: 5,
      valueOptions: [5, 15],
    },
  },
  pointRadius: {
    deckGLName: 'getPointRadius',
    defaultValue: {
      value: 5,
    },
  },
  lineWidth: {
    deckGLName: 'getLineWidth',
    defaultValue: 1,
    byProducts: { stroked: true },
  },
  lineColor: {
    deckGLName: 'getLineColor',
    defaultValue: [39, 85, 196],
    byProducts: { stroked: true },
  },
  elevation: {
    deckGLName: 'getElevation',
    defaultValue: [0, 1000],
    byProducts: {
      extruded: true,
      parameters: {
        depthTest: true,
      },
    },
  },
  icon: {
    deckGLName: 'getIcon',
    defaultValue: () => () => 'marker',
  },
  text: {
    deckGLName: 'getText',
    defaultValue: '',
  },
  color: {
    deckGLName: 'getColor',
    defaultValue: [42, 42, 42],
  },
  size: {
    deckGLName: 'getSize',
    defaultValue: 12,
  },
  angle: {
    deckGLName: 'getAngle',
    defaultValue: 0,
  },
  anchor: {
    deckGLName: 'getTextAnchor',
    defaultValue: 'start',
  },
  alignment: {
    deckGLName: 'getAlignmentBaseline',
    defaultValue: 'bottom',
  },
  pixelOffset: {
    deckGLName: 'getPixelOffset',
    defaultValue: [10, -10],
  },
  backgroundPadding: {
    deckGLName: 'backgroundPadding',
    defaultValue: [6, 4, 6, 4],
  },
  backgroundColor: {
    deckGLName: 'getBackgroundColor',
    defaultValue: [239, 242, 247],
  },
  borderColor: {
    deckGLName: 'getBorderColor',
    defaultValue: [0, 0, 0, 255],
  },
  borderWidth: {
    deckGLName: 'getBorderWidth',
    defaultValue: 0,
  },
  sourceArcColor: {
    deckGLName: 'getSourceColor',
    defaultValue: [54, 111, 228],
    byProducts: { stroked: true },
  },
  targetArcColor: {
    deckGLName: 'getTargetColor',
    defaultValue: [250, 175, 21],
    byProducts: { stroked: true },
  },
  arcWidth: {
    deckGLName: 'getWidth',
    defaultValue: {
      value: 2,
      valueOptions: [2, 10],
    },
    byProducts: { stroked: true },
  },
  arcHeight: {
    deckGLName: 'getHeight',
    defaultValue: 1,
  },
  arcTilt: {
    deckGLName: 'getTilt',
    defaultValue: 0,
  },
  tentativeFillColor: {
    deckGLName: 'getTentativeFillColor',
    defaultValue: [253, 217, 114],
  },
  tentativeLineColor: {
    deckGLName: 'getTentativeLineColor',
    defaultValue: [215, 142, 15],
  },
  tentativeLineWidth: {
    deckGLName: 'getTentativeLineWidth',
    defaultValue: 2,
  },
  editHandlePointColor: {
    deckGLName: 'getEditHandlePointColor',
    defaultValue: [182, 38, 40],
  },
  editHandlePointOutlineColor: {
    deckGLName: 'getEditHandlePointOutlineColor',
    defaultValue: [255, 255, 255],
  },
  editHandlePointRadius: {
    deckGLName: 'getEditHandlePointRadius',
    defaultValue: 4,
  },
}

export const PROP_TYPES = Object.keys(PROP_CONFIGURATIONS).reduce((acc, curr) => {
  acc[curr] = curr
  return acc
}, {})
