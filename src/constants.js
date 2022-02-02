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
}

export const LEGEND_SIZE = {
  small: {
    label: 'sm',
    width: 120,
  },
  large: {
    label: 'lg',
    width: 80,
  },
  zeroValues: {
    width: 20,
  },
}

export const LEGEND_SIZE_LABELS = Object.values(LEGEND_SIZE).reduce((agg, { label }) => {
  agg = label ? [...agg, label] : agg
  return agg
}, [])

export const LEGEND_POSITION = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

export const LEGEND_DOTS = {
  lg: 5,
  sm: 4,
}
export const LEGEND_RADIUS_SIZE = {
  default: 5,
  zero: 20,
}

export const  LEGEND_SYMBOL_WIDTH = {
  lg: 120,
  sm: 80,
  zero: 20,
}
