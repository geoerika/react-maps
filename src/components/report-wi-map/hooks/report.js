import { useReducer, useEffect } from 'react'

import { useQuery } from 'react-query'

import { calculateReportWIMetrics } from '../utils'

// for manual changing of report duration
export const useReport = ({ getReport, report_id, layer_id, map_id, currentDuration }) => {
  const {
    isSuccess,
    // error,
    data: payload,
  } = useQuery(
    // unique query key (for caching, etc.)
    [report_id, layer_id, map_id, currentDuration],
    () => getReport({ report_id, layer_id, map_id, currentDuration }),
  )

  const [report, reportDispatch] = useReducer((state, { type, payload }) => {
    if (['init', 'single_period'].includes(type)) {
      const { duration, durationKey, durations, data } = payload
      const value = {
        [durationKey]: {
          data,
          duration,
          metrics: data.reduce(calculateReportWIMetrics, {}),
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
    if (isSuccess) {
      reportDispatch({ type: currentDuration.length ? 'single_period' : 'init', payload })
    }
  }, [isSuccess, currentDuration.length, payload])

  return report
}

// For using all report durations
export const useFullReport = ({ getReport, report_id, layer_id, map_id }) => {
  const {
    // isLoading,
    // error,
    data: payload,
  } = useQuery(
    [report_id, layer_id, map_id],
    () => getReport({ report_id, layer_id, map_id }),
  )

  const {
    isSuccess,
    // error,
    data: durationData,
  } = useQuery(
    [report_id, layer_id, map_id, payload?.durations],
    () => Promise.all(payload?.durations?.map(currentDuration => getReport({ report_id, layer_id, map_id, currentDuration }))),
    { enabled: payload },
  )

  const [report, reportDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'full_report') {
      const { duration, durations, fullReport } = payload
      return {
        duration,
        durations, // TODO convert into object with keys
        ...fullReport,
      }
    }
    return {
      ...state,
      [type]: payload,
    }
  }, { duration: {}, durations: [] }) // { currentDuration: durationKey, [durationKey]: { data, metric } }

  // TODO make .reduce more efficient
  // TODO don't re-use POI meta data, only report metrics
  useEffect(() => {
    if (isSuccess) {
      const { data, duration, durations } = payload
      const fullReport = {
        [duration.key]: { data, metrics: data.reduce(calculateReportWIMetrics, {}) },
        ...durationData.reduce((agg, ele) => ({
          ...agg,
          [ele.duration.key]: {
            ...ele,
            metrics: ele.data.reduce(calculateReportWIMetrics, {}), // { min, max }
          },
        }), {}),
      }
      reportDispatch({ type: 'full_report', payload: { duration, durations, fullReport } })
    }
  }, [isSuccess, payload, durationData])

  return report
}
