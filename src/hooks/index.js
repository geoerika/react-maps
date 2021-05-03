import { useState, useEffect, useMemo, useReducer } from 'react'
import { color } from 'd3-color'
import { SCALES } from '../constants'
import { strToArrayColor } from '../shared/utils'


// TODO meaningful representation of elevation and radius based on given values
export const useLegends = ({
  elevationBasedOn = '',
  fillBasedOn = '',
  fillColors,
  objColor = '',
  radiusBasedOn = '',
  metrics,
}) => {
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
        label: fillBasedOn,
      })
    }

    if (elevationBasedOn.length) {
      legends.push({
        type: 'elevation',
        maxColor: objColor || fillColors[1],
        max: (metrics[elevationBasedOn] || {}).max,
        min: (metrics[elevationBasedOn] || {}).min,
        label: elevationBasedOn,
      })
    }

    if (radiusBasedOn.length) {
      legends.push({
        maxColor: objColor || fillColors[1],
        type: 'size',
        dots: 5,
        size: 5,
        zeroRadiusSize: 20,
        max: (metrics[radiusBasedOn] || {}).max,
        min: (metrics[radiusBasedOn] || {}).min,
        label: radiusBasedOn,
      })
    }
    return legends
  }, [elevationBasedOn, fillBasedOn, radiusBasedOn, fillColors, objColor, metrics])

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

export const useTimeline = (timestampInit, speedInterval) => {
  const [player, setPlayer] = useState(false)
  // NOTE: reducers should be "pure", so can't manage the player
  const [timeline, timelineDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'move') {
      const activeIndex = state.activeIndex + 1 * state.direction
      if ((state.direction < 0 && activeIndex <= 0) ||
      (state.direction > 0 && activeIndex >= state.timestamps.length -1)) {
        clearInterval(player)
        setPlayer(false)
      }
      return {
        ...state,
        activeIndex,
      }
    }
    if (type === 'manual') {
      return {
        ...state,
        activeIndex: state.activeIndex + payload,
      }
    }
    if (type === 'speed') {
      return {
        ...state,
        speed: state.speed + payload,
      }
    }
    // reset options and stop timer
    if (type === 'timestamps') {
      return {
        timestamps: payload,
        direction: 1,
        activeIndex: 0,
        speed: speedInterval,
      }
    }

    return {
      ...state,
      [type]: payload,
    }
  }, { direction: 1, activeIndex: 0, speed: speedInterval, timestamps: timestampInit })

  const resetPlayer = speed => oldPlayer => {
    clearInterval(oldPlayer)
    return setInterval(() => timelineDispatch({ type: 'move' }), speed)
  }

  const forward = () => {
    if (player) {
      setPlayer(resetPlayer(timeline.speed))
    }
    timelineDispatch({ type: 'direction', payload: 1 })
  }

  const rewind = () => {
    if (player) {
      setPlayer(resetPlayer(timeline.speed))
    }
    timelineDispatch({ type: 'direction', payload: -1 })
  }

  const startTimeline = () => {
    if(!player) {
      setPlayer(resetPlayer(timeline.speed))
    }
  }

  const stopTimeline = () => {
    clearInterval(player)
    setPlayer(false)
  }

  const changeSpeed = value => () => {
    timelineDispatch({ type: 'speed', payload: value })
    if (player) {
      setPlayer(resetPlayer(timeline.speed + value))
    }
  }

  const reset = () => timelineDispatch({ type: 'activeIndex', payload: 0 })
  const move = payload => () => timelineDispatch({ type: 'manual', payload })

  return {
    forward,
    rewind,
    startTimeline,
    stopTimeline,
    changeSpeed,
    reset,
    move,
    player,
    timelineDispatch,
    ...timeline,
  }
}

export { useReport, useFullReport } from './report'

/**
 * useResizeObserver - returns the dimensions of a changing HTML element
 * based on: https://github.com/plouc/nivo/blob/7d52c07/packages/core/src/hooks/useMeasure.js &
 *           https://github.com/EQWorks/snoke-builder-viz/pull/21/files
 * @param { object } ref - React ref
 * @returns { object } - dimensions { width, height } of an HTML element
 */
export const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const observer = useMemo(() =>
    new ResizeObserver(([entry]) => setDimensions(entry.contentRect))
  ,[])

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref, observer])

  return dimensions
}

/**
 * useArrayFillColors - React hook that converts an array of string format colour in array format
 * @param { object } param
 * @param { string } param.fillColors - array of string format colours ['#0062d9', '#dd196b']
 * @returns { array } - array format colour [[r, g, b]]
 */
export const useArrayFillColors = ({ fillColors }) =>
  useMemo(() =>
    fillColors.map((strColor) => {
      return strToArrayColor({ strColor })
    }), [fillColors])

/**
 * useStrFillColor - React hook that converts an array format colour [r, g, b] in a string format colour
 * @param { object } param
 * @param { array || function } param.getFillColor - function or array of Deck.gl layer fill colours
 * @param { string } param.opacity - opacity value
 * @returns { array } - string format colour 'rgb(r, g, b, opacity)'
 */
// TO DO: this is too specific to default getFillColor in our maps; make it more generic
export const useStrFillColor = ({ getFillColor, opacity }) =>
  useMemo(() => {
    const color = typeof getFillColor === 'function' ? getFillColor(0)(1) : getFillColor
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
  }, [getFillColor, opacity])


/**
 * useGradientFillColors - React hook that converts an array of string format colours
 * ex. ["#0062d9", "#dd196b"] in an array of rgba string format colours
 * @param { object } param
 * @param { string } param.fillColors - array of string format colours ['#0062d9', '#dd196b']
 * * @param { string } param.opacity - opacity value
 * @returns { array } - array of rgba string format colours ['rgb(r, g, b, opacity)']
 */
export const useGradientFillColors = ({ fillColors, opacity }) =>
  useMemo(() =>
    fillColors.map(strColor => {
      const arrayColor = strToArrayColor({ strColor })
      return `rgba(${arrayColor[0]}, ${arrayColor[1]}, ${arrayColor[2]}, ${opacity})`
    })
  , [fillColors, opacity])
