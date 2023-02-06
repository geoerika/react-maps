import { scaleLinear, scaleQuantile, scaleQuantize, scaleLog } from 'd3-scale'


export const DATE_TYPES = { 1: 'Daily', 2: 'Weekly', 3: 'Monthly' }
export const hours = new Array(24).fill(0).map((_, i) => `${i}`)
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const TYPE_POLYGON = {
  code: 1,
  name: 'polygon',
  plural: 'polygons',
}
export const TYPE_RADIUS = {
  code: 2,
  name: 'radius',
  plural: 'radii',
}

export const COLOURS = ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8']

export const SCALES = {
  'linear': scaleLinear,
  'log': scaleLog,
  'quantile': scaleQuantile,
  'quantize': scaleQuantize,
}

export const CLUSTER_SIZE_SCALE = 40
export const SUPERCLUSTER_ZOOM = 20

export const LEGEND_TYPE = {
  size: 'size',
  elevation: 'elevation',
  gradient: 'gradient',
  lineWidth: 'line width',
  icon: 'icon',
}

export const LEGEND_SIZE = {
  small: 'sm',
  large: 'lg',
}

export const LEGEND_POSITION = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

export const LEGEND_DOTS = {
  sm: 4,
  lg: 5,
}
export const LEGEND_RADIUS_SIZE = {
  zero: 1.25,
  default: 0.325,
}

export const  LEGEND_SYMBOL_WIDTH = {
  zero: 1.25,
  sm: 5,
  lg: 7.5,
}

export const LEGEND_HEIGHT = {
  left: {
    sm: 1,
    lg: 1.325,
  },
  right: {
    sm: 3.125,
    lg: 5.25,
  },
}

export const MIN_LEGEND_LINE_WIDTH = 2

export const LEGEND_LINE_HEIGHT = {
  min: .15,
  max: .4,
}

export const LEGEND_TITLE_BOTTOM_MARGIN = {
  default: 0.4,
  lineWidth: 0.135,
}

export const LEGEND_TEXT_GAP = 0.5

export const GEOJSON_TYPES = {
  point: 'Point',
  polygon: 'Polygon',
  multipolygon: 'MultiPolygon',
}

export const FONT_SIZE = getComputedStyle(document.documentElement).fontSize.slice(0, -2) || 16

export const CURSOR_BUFFER = 12
export const CURSOR_BUFFER_X = 5
export const TOOLTIP_BUFFER = 2.5
