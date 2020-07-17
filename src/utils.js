// TODO more built in types, e.g. intervals, filter
// TODO cap max & mins
export const intensityByMetric = ({
  intensityCallback = false,
  invert = false,
  multiplier,
  base,
  metric,
  data,
}) => {
  if (intensityCallback) return d => intensityCallback(d) * multiplier + base
  const { max, min } = data.reduce((agg, ele) => {
    agg.max = Math.max(agg.max, ele[metric])
    agg.min = Math.min(agg.min, ele[metric])
    return agg
  }, { max: null, min: null })
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => intensity(d[metric]) * multiplier + base
}

export const colorIntensityByMetric = ({
  intensityCallback = false,
  invert = false,
  color, // [{ base, multiplier }]
  metric,
  data,
}) => {
  if (intensityCallback) return d => color.map(({ base, multiplier }) => intensityCallback(d) * multiplier + base)
  const { max, min } = data.reduce((agg, ele) => {
    agg.max = Math.max(agg.max, ele[metric])
    agg.min = Math.min(agg.min, ele[metric])
    return agg
  }, { max: null, min: null })
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => color.map(({ base, multiplier }) => intensity(d[metric]) * multiplier + base)
}
