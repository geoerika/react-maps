import React, { useState, useEffect, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import { intensityByMetric, colorIntensityByMetric } from '../utils'
import { reportWI } from '../datasets'


const propTypes = {
  getReport: PropTypes.func.isRequired,
  report_id: PropTypes.number.isRequired,
  layer_id: PropTypes.number.isRequired,
  map_id: PropTypes.number.isRequired,
  radiusBasedOn: PropTypes.string,
  fillBasedOn: PropTypes.string,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  opacity: PropTypes.number,
  getRadius: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
  ]),
  radiusUnits: PropTypes.string,
  filled: PropTypes.bool,
  getFillColor: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  stroked: PropTypes.bool,
  lineWidthUnits: PropTypes.string,
  getLineWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
  ]),
  getLineColor: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.string,
  defaultKeyMetric: PropTypes.string,
}

const defaultProps = {
  radiusBasedOn: '',
  fillBasedOn: '',
  onClick: undefined,
  onHover: undefined,
  opacity: 0.8,
  getRadius: 10,
  // radiusScale: 5,
  radiusUnits: 'pixels',
  // radiusMinPixels: 10,
  // radiusMaxPixels: 100,
  // getColor: () => null,
  filled: true,
  getFillColor: [255, 140, 0],
  // lineWidthUnits,
  // lineWidthMinPixels: 1,
  // lineWidthMaxPixels: 10,
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 2,
  getLineColor: [0, 0, 0],
  showLegend: false,
  legendPosition: 'top-left',
  defaultKeyMetric: 'visits',
}

// DeckGL react component
const ReportWIMap = ({
  getReport,
  report_id,
  layer_id,
  map_id,
  radiusBasedOn,
  fillBasedOn,
  onClick,
  onHover,
  opacity,
  getRadius,
  getFillColor,
  getLineWidth,
  getLineColor,
  showLegend,
  legendPosition,
  defaultKeyMetric,
  ...scatterLayerProps
}) => {
  // TODO: expose some configuration of how metric/keyMetric relates to legends
  const [{ data, metrics }, metricDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'data') {
      // calculate all min and max
      // { [key]: { max, min }}
      const metrics =  payload.reduce((agg, row) => ({
        ...reportWI.DATA_FIELDS.reduce((rowAgg, key) => ({
          ...rowAgg,
          [key]: {
            max: Math.max((agg[key] || { max: null }).max, row[key]),
            min: Math.min((agg[key] || { min: null }).min, row[key]),
          }
        }), {})
      }), {})
      // persists old keyMetric
      const keyMetric = state.keyMetric || defaultKeyMetric
      return {
        data: payload,
        metrics,
        keyMetric,
      }
    }
    // else just change the "key metric"
    return {
      ...state,
      [type]: payload,
    }
  }, { data: [], metrics: {} })

  useEffect(() => {
    const getData = async () => {
      // TODO properly set layers!
      const reportData = await getReport({ report_id, layer_id, map_id })
      metricDispatch({ type: 'data', payload: reportData })
    }
    getData()
  }, [report_id, layer_id, map_id])

  const layers = useMemo(() => {
    /*
      for all `getXYZ`, can be a raw value OR computed for each element{} of data[], provided through callback,
      for onHover and onClick:
      {
        color: Uint8Array(4) [56, 0, 0, 1]
        coordinate: (2) [-82.33413799645352, 42.89068626794389]
        devicePixel: (2) [581, 201]
        index: 55
        layer: LAYER_OBJECT
        lngLat: (2) [-82.33413799645352, 42.89068626794389]
        object: ORIGINAL_OBJECT
        picked: true
        pixel: (2) [528.1272270872279, 401.75357112382653]
        pixelRatio: 1.099740932642487
        x: 528.1272270872279
        y: 401.75357112382653
      }
    */
    // TODO: multiplier & base values through props
    const finalGetRadius = radiusBasedOn.length ? intensityByMetric({
      multiplier: 40,
      base: 8,
      metric: radiusBasedOn,
      ...metrics[radiusBasedOn], // max & min
    }) : getRadius
    const finalGetFillColor = fillBasedOn.length ? colorIntensityByMetric({
      color: [{ base: 100, multiplier: 155 }, { base: 0, multiplier: 0 }, { base: 0, multiplier: 0 }, { base: 255, multiplier: 0 }],
      metric: fillBasedOn,
      ...metrics[fillBasedOn], // max & min
    }) : getFillColor
    return [
      Scatter({
        id: `${report_id}-report-scatterplot-layer`,
        data,
        getPosition: d => [d.lon, d.lat],
        pickable: onClick || onHover,
        onClick,
        onHover,
        opacity,
        getRadius: finalGetRadius,
        getFillColor: finalGetFillColor,
        getLineWidth,
        getLineColor,
        ...scatterLayerProps,
      })
    ]
  }, [data])

  const legends = useMemo(() => {
    const legends = []
    if (fillBasedOn.length) {
      legends.push({
        color: [255,0,0],
        type: 'gradient',
        max: (metrics[fillBasedOn] || {}).max,
        min: (metrics[fillBasedOn] || {}).min,
        // TODO: readable labels
        label: fillBasedOn,
      })
    }
    if (radiusBasedOn.length) {
      legends.push({
        color: [255,0,0],
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
  }, [radiusBasedOn, fillBasedOn, data])

  return (
    <Map
      layers={layers}
      showLegend={showLegend}
      position={legendPosition}
      legends={legends}
    />
  )
}

ReportWIMap.propTypes = propTypes
ReportWIMap.defaultProps = defaultProps

export default ReportWIMap
