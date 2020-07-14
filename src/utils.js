// TODO more built in types
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
    agg.min = Math.max(agg.min, ele[metric])
    return agg
  }, { max: null, min: null })
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => intensity(d[metric]) * multiplier + base
}
