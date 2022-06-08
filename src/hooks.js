import { useState, useEffect, useMemo, useReducer, useCallback } from 'react'

import { color } from 'd3-color'

import { SCALES } from './constants'
import { setLegendConfigs } from './utils/legend'


// TODO meaningful representation of elevation and radius based on given values
export const useLegends = ({
  elevationBasedOn = '',
  fillBasedOn = '',
  fillColors,
  objColor = '',
  radiusBasedOn = '',
  data = [],
  dataPropertyAccessor = d => d,
  ...legendProps
}) => {
  const legends = useMemo(() => setLegendConfigs({
    elevationBasedOn,
    fillBasedOn,
    fillColors,
    objColor,
    radiusBasedOn,
    data,
    dataPropertyAccessor,
    ...legendProps,
  }), [
    elevationBasedOn,
    fillBasedOn,
    radiusBasedOn,
    fillColors,
    objColor,
    data,
    dataPropertyAccessor,
    legendProps,
  ])

  return legends
}

export const useMapData = ({
  dataAccessor = d => d,
  dataPropertyAccessor = d => d,
  keyTypes = ['number'],
  excludeKeys = ['lat', 'lon', 'poi_id', 'chain_id', 'report_id'],
  staticDataKeys = false,
}) => {
  // TODO use d3 to support multiple scales
  const [{ data, metrics }, metricDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'data') {
      const DATA_FIELDS = staticDataKeys || Object.entries(dataPropertyAccessor(dataAccessor(payload)[0]))
        .filter(entry => keyTypes.includes(typeof entry[1]) && !excludeKeys.includes(entry[0]))
        .map(([k]) => k)
      // { [key]: { max, min }}
      // calculate all min and max
      const metrics =  dataAccessor(payload).reduce((agg, ele) => ({
        ...DATA_FIELDS
          .reduce((rowAgg, key) => ({
            ...rowAgg,
            [key]: {
              max: Math.max((agg[key] || { max: null }).max, dataPropertyAccessor(ele)[key]),
              min: Math.min((agg[key] || { min: null }).min, dataPropertyAccessor(ele)[key]),
            },
          }), {}),
      }), {})

      return {
        data: payload,
        metrics,
      }
    }
    return {
      ...state,
      [type]: payload,
    }
  }, { data: [], metrics: {} })
  return {
    data,
    metrics,
    metricDispatch,
  }
}

export const useElevation = ({
  elevationBasedOnInit,
  getElevation,
  elevationDataScale,
  elevations,
  metrics,
  dataPropertyAccessor = d => d,
}) => {
  const [elevationBasedOn, setElevationBasedOn] = useState(elevationBasedOnInit)

  useEffect(() => {
    setElevationBasedOn(elevationBasedOnInit)
  }, [elevationBasedOnInit])

  const finalGetElevation = useMemo(() => {
    if (elevationBasedOn.length) {
      const d3Fn = SCALES[elevationDataScale]([
        (metrics[elevationBasedOn] || { min: 0 }).min,
        (metrics[elevationBasedOn] || { max: 10 }).max,
      ], elevations)
      return d => d3Fn(dataPropertyAccessor(d)[elevationBasedOn])
    }
    return getElevation
  }, [elevationBasedOn, elevationDataScale, elevations, getElevation, metrics, dataPropertyAccessor])

  return { elevationBasedOn, finalGetElevation, setElevationBasedOn }
}

export const useFill = ({
  fillBasedOnInit,
  getFillColor,
  fillDataScale,
  fillColors,
  metrics,
  dataPropertyAccessor = d => d,
}) => {
  const [fillBasedOn, setFillBasedOn] = useState(fillBasedOnInit)

  useEffect(() => {
    setFillBasedOn(fillBasedOnInit)
  }, [fillBasedOnInit])

  const finalGetFillColor = useMemo(() => {
    if (fillBasedOn.length) {
      const d3Fn = SCALES[fillDataScale]([
        (metrics[fillBasedOn] || { min: 0 }).min,
        (metrics[fillBasedOn] || { max: 10 }).max,
      ], fillColors)
      return d => {
        const ret = color(d3Fn(dataPropertyAccessor(d)[fillBasedOn]))
        return [ret.r, ret.g, ret.b]
      }
    }
    return getFillColor
  }, [fillBasedOn, fillDataScale, fillColors, getFillColor, metrics, dataPropertyAccessor])

  return { fillBasedOn, finalGetFillColor, setFillBasedOn }
}

export const useRadius = ({
  radiusBasedOnInit,
  getRadius,
  radiusDataScale,
  radii,
  metrics,
  dataPropertyAccessor = d => d,
}) => {
  const [radiusBasedOn, setRadiusBasedOn] = useState(radiusBasedOnInit)

  useEffect(() => {
    setRadiusBasedOn(radiusBasedOnInit)
  }, [radiusBasedOnInit])

  const finalGetRadius = useMemo(() => {
    if (radiusBasedOn.length) {
      const d3Fn = SCALES[radiusDataScale]([
        (metrics[radiusBasedOn] || { min: 0 }).min,
        (metrics[radiusBasedOn] || { max: 10 }).max,
      ], radii)

      return d => d3Fn(dataPropertyAccessor(d)[radiusBasedOn])
    }
    return getRadius
  }, [radiusBasedOn, radiusDataScale, radii, getRadius, metrics, dataPropertyAccessor])

  return { finalGetRadius, setRadiusBasedOn }
}

// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
export const useClientRect = () => {
  const [rect, setRect] = useState({})
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])
  return [rect, ref]
}
