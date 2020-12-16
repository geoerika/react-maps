import { reportWI } from './datasets'


// TODO more built in types, e.g. intervals, filter
// TODO cap max & mins
export const intensityByMetric = ({
  intensityCallback = false,
  invert = false,
  multiplier,
  base,
  metric,
  metricStats: { max, min },
  getDataObject = d => d,
}) => {
  if (intensityCallback) return d => intensityCallback(d) * multiplier + base
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => intensity(getDataObject(d)[metric]) * multiplier + base
}

export const colorIntensityByMetric = ({
  intensityCallback = false,
  invert = false,
  color, // [{ base, multiplier }]
  metric,
  metricStats: { max, min },
  getDataObject = d => d,
}) => {
  if (intensityCallback) return d => color.map(({ base, multiplier }) => intensityCallback(d) * multiplier + base)
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => color.map(({ base, multiplier }) => intensity(getDataObject(d)[metric]) * multiplier + base)
}

export const genUniqueDateKey = o => `${o.date_type}_//_${o.start_date}_//_${o.end_date}`

export const calculateReportWIMetrics = (agg, row) => ({
  ...reportWI.DATA_FIELDS.reduce((rowAgg, key) => ({
    ...rowAgg,
    [key]: {
      max: Math.max((agg[key] || { max: null }).max, row[key]),
      min: Math.min((agg[key] || { min: null }).min, row[key]),
    },
  }), {}),
})
