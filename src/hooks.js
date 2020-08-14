import { useState, useEffect, useMemo, useReducer } from 'react'
import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { color } from 'd3-color'


// TODO meaningful representation of elevation and radius based on given values
export const useLegends = ({ elevationBasedOn = '', fillBasedOn = '', fillColors, radiusBasedOn = '', metrics }) => {
  const legends = useMemo(() => {
    const legends = []
    if (fillBasedOn.length) {
      // TODO support quantile/quantize
      // i.e. different lengths of fillColors[]
      legends.push({
        minColor: fillColors[0],
        maxColor: fillColors[1],
        type: 'gradient',
        max: (metrics[fillBasedOn] || {}).max,
        min: (metrics[fillBasedOn] || {}).min,
        // TODO: readable labels
        label: fillBasedOn,
      })
    }

    if (elevationBasedOn.length) {
      legends.push({
        type: 'elevation',
        max: (metrics[fillBasedOn] || {}).max,
        min: (metrics[fillBasedOn] || {}).min,
        // TODO: readable labels
        label: elevationBasedOn,
      })
    }

    if (radiusBasedOn.length) {
      legends.push({
        maxColor: fillColors[1],
        type: 'size',
        dots: 5,
        size: 5,
        max: (metrics[radiusBasedOn] || {}).max,
        min: (metrics[radiusBasedOn] || {}).min,
        // TODO: readable labels
        label: radiusBasedOn,
      })
    }
    return legends
  }, [elevationBasedOn, fillBasedOn, radiusBasedOn, fillColors, metrics])

  return legends
}

const SCALES = {
  'linear': scaleLinear,
  'quantile': scaleQuantile,
  'quantize': scaleQuantize,
}

export const useElevation = ({
  elevationBasedOnInit,
  getElevation,
  elevationDataScale,
  elevations,
  metrics
}) => {
  const [elevationBasedOn, setElevationBasedOn] = useState(elevationBasedOnInit)

  useEffect(() => {
    setElevationBasedOn(elevationBasedOnInit)
  }, [elevationBasedOnInit])

  const finalGetElevation = useMemo(() => {
    if (elevationBasedOn.length) {
      const d3Fn = SCALES[elevationDataScale]([
        (metrics[elevationBasedOn] || { min: 0 }).min,
        (metrics[elevationBasedOn] || { max: 10 }).max
      ], elevations)
      return d => d3Fn(d[elevationBasedOn])
    }
    return getElevation
  }, [elevationBasedOn, elevationDataScale, elevations, getElevation, metrics])

  return { finalGetElevation, setElevationBasedOn }
}

export const useFill = ({
  fillBasedOnInit,
  getFillColor,
  fillDataScale,
  fillColors,
  metrics,
}) => {
  const [fillBasedOn, setFillBasedOn] = useState(fillBasedOnInit)

  useEffect(() => {
    setFillBasedOn(fillBasedOnInit)
  }, [fillBasedOnInit])

  const finalGetFillColor = useMemo(() => {
    if (fillBasedOn.length) {
      const d3Fn = SCALES[fillDataScale]([
        (metrics[fillBasedOn] || { min: 0 }).min,
        (metrics[fillBasedOn] || { max: 10 }).max
      ], fillColors)
      return d => {
        const ret = color(d3Fn(d[fillBasedOn]))
        return [ret.r, ret.g, ret.b]
      }
    }
    return d => {
      return getFillColor(d)
    }
  }, [fillBasedOn, fillDataScale, fillColors, getFillColor, metrics])

  return { finalGetFillColor, setFillBasedOn }
}

export const useRadius = ({
  radiusBasedOnInit,
  getRadius,
  radiusDataScale,
  radii,
  metrics,
}) => {
  const [radiusBasedOn, setRadiusBasedOn] = useState(radiusBasedOnInit)

  useEffect(() => {
    setRadiusBasedOn(radiusBasedOnInit)
  }, [radiusBasedOnInit])

  const finalGetRadius = useMemo(() => {
    if (radiusBasedOn.length) {
      const d3Fn = SCALES[radiusDataScale]([
        (metrics[radiusBasedOn] || { min: 0 }).min,
        (metrics[radiusBasedOn] || { max: 10 }).max
      ], radii)

      return d => d3Fn(d[radiusBasedOn])
    }
    return getRadius
  }, [radiusBasedOn, radiusDataScale, radii, getRadius, metrics])

  return { finalGetRadius, setRadiusBasedOn }
}
