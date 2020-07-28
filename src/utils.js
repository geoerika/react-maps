// TODO more built in types, e.g. intervals, filter
// TODO cap max & mins
export const intensityByMetric = ({
  intensityCallback = false,
  invert = false,
  multiplier,
  base,
  metric,
  max,
  min,
  getDataObject = d => d
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
  max,
  min,
  getDataObject = d => d
}) => {
  if (intensityCallback) return d => color.map(({ base, multiplier }) => intensityCallback(d) * multiplier + base)
  let intensity = v => (v - min) / (max - min)
  if (invert) intensity = v => (max - v) / (max - min)
  if (max === min) intensity = () => 1
  return d => color.map(({ base, multiplier }) => intensity(getDataObject(d)[metric]) * multiplier + base)
}
