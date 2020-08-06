import { useState, useEffect, useMemo, useReducer } from 'react'
import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { color } from 'd3-color'
import { days, hours } from './datasets'
import { calculateReportWIMetrics } from './utils'


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

export const useMapData = ({
  dataAccessor = d => d,
  dataPropertyAccessor = d => d,
  keyTypes = ['number'],
  excludeKeys = ['lat', 'lon'],
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
            }
          }), {})
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
        (metrics[elevationBasedOn] || { max: 10 }).max
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
        (metrics[fillBasedOn] || { max: 10 }).max
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
        (metrics[radiusBasedOn] || { max: 10 }).max
      ], radii)

      return d => d3Fn(dataPropertyAccessor(d)[radiusBasedOn])
    }
    return getRadius
  }, [radiusBasedOn, radiusDataScale, radii, getRadius, metrics, dataPropertyAccessor])

  return { finalGetRadius, setRadiusBasedOn }
}

// for manual changing of report duration
export const useReport = ({ getReport, report_id, layer_id, map_id, currentDuration }) => {
  const [report, reportDispatch] = useReducer((state, { type, payload }) => {
    if (['init', 'single_period'].includes(type)) {
      const { duration, durationKey, durations, data } = payload
      const value = {
        [durationKey]: {
          data,
          duration,
          metrics: data.reduce(calculateReportWIMetrics, {})
        },
        currentDuration: durationKey,
      }
      // TODO is this necessary? 'durations' is sent with every request
      if (type === 'init') {
        value.durations = durations
      }
      return {
        ...state,
        ...value,
      }
    }
    return {
      ...state,
      [type]: payload,
    }
  }, {}) // { currentDuration: durationKey, [durationKey]: { data, metric } }

  useEffect(() => {
    const getData = async () => {
      const payload = await getReport({ report_id, layer_id, map_id, currentDuration })
      reportDispatch({
        type: currentDuration.length ? 'single_period' : 'init',
        payload,
      })
    }
    getData()
  }, [getReport, report_id, layer_id, map_id, currentDuration])

  return report
}

// For using all report durations
export const useFullReport = ({ getReport, report_id, layer_id, map_id }) => {  
  const [report, reportDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'full_report') {
      const { currentDuration, fullReport } = payload
      return {
        currentDuration,
        ...fullReport,
      }
    }
    return {
      ...state,
      [type]: payload,
    }
  }, { currentDuration: '' }) // { currentDuration: durationKey, [durationKey]: { data, metric } }

  // TODO make .reduce more efficient
  // TODO don't re-use POI meta data, only report metrics
  useEffect(() => {
    const getData = async () => {
      const { data, durationKey, durations } = await getReport({ report_id, layer_id, map_id })
      const durationData = await Promise.all(durations.map(currentDuration => getReport({ report_id, layer_id, map_id, currentDuration })))
      const fullReport = {
        [durationKey]: { data, metrics: data.reduce(calculateReportWIMetrics, {}) },
        ...durationData.reduce((agg, ele) => ({
          ...agg,
          [ele.durationKey]: {
            ...ele,
            metrics: ele.data.reduce(calculateReportWIMetrics, {}) // { min, max }
          },
        }), {})
      }
      reportDispatch({ type: 'full_report', payload: { currentDuration: durationKey, fullReport } })
    }
    getData()
  }, [getReport, report_id, layer_id, map_id])

  return report
}

// FOUR TYPES:
// within a given duration, cycle DoW
// within a given duration, cycle HoD
// between durations, same DoW
// between durations, same HoD

const getTimeStampOptions = timestamps => {
  // dow, hod or [Date]
  if (timestamps === 'days') return days
  if (timestamps === 'hours') return hours
  return timestamps
}

export const useTimeline = (timestampInit, speedInterval) => {
  const timestamps = getTimeStampOptions(timestampInit)
  const [timeline, timelineDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'move') {
      const activeIndex = state.activeIndex + 1 * state.direction
      if ([timestamps.length - 1, 0].includes(activeIndex)) {
        clearInterval(player)
      }
      return {
        ...state,
        activeIndex,
      }
    }
    if (type === 'speed') {
      return {
        ...state,
        speed: state.speed + payload
      }
    }
    return {
      ...state,
      [type]: payload,
    }
  }, { direction: 1, activeIndex: 0, speed: speedInterval })  

  const [player, setPlayer] = useState(false)

  const play = () => timelineDispatch({ type: 'direction', payload: 1 })

  const rewind = () => timelineDispatch({ type: 'direction', payload: -1 })

  const startTimeline = () => {
    setPlayer(setInterval(() => timelineDispatch({ type: 'move' }), timeline.speed))
  }

  const stopTimeline = () => {
    clearInterval(player)
    setPlayer(false)
  }

  const changeSpeed = value => () => {
    clearInterval(player)
    timelineDispatch({ type: 'speed', payload: value })
    // will this speed update take effect, or should it be timeline.speed + value
    setPlayer(setInterval(() => timelineDispatch({ type: 'move' }), timeline.speed))
  }

  return {
    play,
    rewind,
    startTimeline,
    stopTimeline,
    changeSpeed,
    timestamps,
    ...timeline,
  }
}
