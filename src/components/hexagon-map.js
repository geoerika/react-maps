import React, { useState, useEffect, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'

import { HexagonLayer } from 'deck.gl'

import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { color } from 'd3-color'

import Map from './generic-map'
import Loader from './loader'


const propTypes = {
  defaultFillBasedOn: PropTypes.string,
  fillDataScale: PropTypes.string,
  fillColors: PropTypes.array,
  defaultElevationBasedOn: PropTypes.string,
  elevationDataScale: PropTypes.string,
  elevations: PropTypes.array,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  opacity: PropTypes.number,
  filled: PropTypes.bool,
  getFillColor: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  extruded: PropTypes.bool,
  getElevation: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
  ]),
  // elevationScale
  stroked: PropTypes.bool,
  lineWidthUnits: PropTypes.string,
  getLineWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
  ]),
  getLineColor: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.string,
}

const defaultProps = {
  defaultFillBasedOn: '',
  fillDataScale: 'linear',
  fillColors: [interpolateBlues(0), interpolateBlues(1)],
  defaultElevationBasedOn: '',
  elevationDataScale: 'linear',
  elevations: [0, 10000],
  onClick: undefined,
  onHover: undefined,
  opacity: 0.8,
  filled: true,
  getFillColor: [255, 0, 0],
  extruded: false,
  getElevation: 0,
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 2,
  getLineColor: [0, 0, 0],
  showLegend: false,
  legendPosition: 'top-left',
}

const SCALES = {
  'linear': scaleLinear,
  'quantile': scaleQuantile,
  'quantize': scaleQuantize,
}

const HexLayerMap = ({
  defaultFillBasedOn,
  fillDataScale,
  fillColors,
  defaultElevationBasedOn,
  elevationDataScale,
  elevations,
  onClick,
  onHover,
  opacity,
  getElevation,
  getFillColor,
  getLineWidth,
  getLineColor,
  showLegend,
  legendPosition,
  ...hexLayerProps
}) => {
  const handleSetData = d => {
    if (Array.isArray(d)) {
      metricDispatch({ type: 'data', payload: d })
    } else {
      try {
        const payload = JSON.parse(d)
        // basic validation
        if (Array.isArray(payload)) {
          metricDispatch({ type: 'data', payload })
        }
      } catch (e) {
        console.warn('Not Valid JSON')
      }
    }
  }

  // TODO more finely woven state to link these with data/metrics
  const [fillBasedOn, setFillBasedOn] = useState(defaultFillBasedOn)
  const [elevationBasedOn, setElevationBasedOn] = useState(defaultFillBasedOn)
  useEffect(() => {
    setFillBasedOn(defaultFillBasedOn)
  }, [defaultFillBasedOn])
  useEffect(() => {
    setElevationBasedOn(defaultElevationBasedOn)
  }, [defaultElevationBasedOn])
  // TODO unify common processing for GENERIC/INFERRED data
  // fillBasedOn, radiusBasedOn, elevationBasedOn
  // legends, metrics
  const [{ data, metrics }, metricDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'data') {
      // calculate all min and max
      // { [key]: { max, min }}
      const DATA_FIELDS = Object.entries(payload[0])
        .filter(entry => typeof entry[1] === 'number' && !['lat', 'lon'].includes(entry[0]))
        .map(([k]) => k)
      const metrics =  payload.reduce((agg, ele) => ({
        ...DATA_FIELDS
          .reduce((rowAgg, key) => ({
            ...rowAgg,
            [key]: {
              max: Math.max((agg[key] || { max: null }).max, ele[key]),
              min: Math.min((agg[key] || { min: null }).min, ele[key]),
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

  const finalGetElevation = useMemo(() => {
    if (elevationBasedOn.length) {
      const d3Fn = SCALES[elevationDataScale]([
        (metrics[elevationBasedOn] || { min: 0 }).min,
        (metrics[elevationBasedOn] || { max: 10 }).max
      ], elevations)
      return d => {
        return d3Fn(d[elevationBasedOn])
      }
    }
    return getElevation
  }, [elevationBasedOn, elevationDataScale, elevations, getElevation, metrics])
  console.log(fillColors)
  const layers = useMemo(() => ([
    new HexagonLayer({
      id: `xyz-hex-layer`,
      data,
      getPosition: d => [d.lon, d.lat],
      pickable: onClick || onHover,
      onClick,
      onHover,
      opacity,
      extruded: true,
      radius: 1000, // max size of each hex
      upperPercentile: 100, // top end of data range
      coverage: 1, // how much of the radius each hex fills
      // NOTE: values are calculated automatically, using ranges below
      colorRange: fillColors.map(o => {
        const c = color(o)
        return [c.r, c.g, c.b]
      }),
      elevationRange: elevations,
      getColorWeight:d => d[fillBasedOn] || 1,
      getElevationWeight: d => d[elevationBasedOn] || 1,
      // getFillColor: finalGetFillColor,
      // getElevation: finalGetElevation,
      getLineWidth,
      getLineColor,
      updateTriggers: {
        getColorWeight: [finalGetFillColor, fillDataScale, fillColors, metrics],
        getElevationWeight: [finalGetElevation, elevationDataScale, elevations, metrics],
      },
      ...hexLayerProps,
    })
  ]), [
    hexLayerProps,
    data,
    onClick,
    onHover,
    finalGetElevation,
    finalGetFillColor,
    elevations,
    elevationBasedOn,
    elevationDataScale,
    fillColors,
    fillBasedOn,
    fillDataScale,
    getLineColor,
    getLineWidth,
    opacity,
    metrics,
  ])

  const legends = useMemo(() => {
    let legends = undefined
    if (fillBasedOn.length) {
      if (!legends) legends = []
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
      if (!legends) legends = []
      legends.push({
        type: 'elevation',
        max: (metrics[fillBasedOn] || {}).max,
        min: (metrics[fillBasedOn] || {}).min,
        // TODO: readable labels
        label: elevationBasedOn,
      })
    }
    return legends
  }, [elevationBasedOn, fillBasedOn, fillColors, metrics])

  return (
    <div>
      <div>
        <div style={{ padding: '1rem', border: '1px dashed black' }}>
          <Loader setData={handleSetData} accept='text/plain, .csv, application/json' />
        </div>
        <div>
          <strong>Fill Based On</strong>
          <select onChange={e => setFillBasedOn(e.target.value)}>
            <option value=''>None</option>
            {Object.keys(metrics).map(key => <option key={key} selected={key === fillBasedOn}>{key}</option>)}
          </select>
        </div>
        <div>
          <strong>Elevation Based On</strong>
          <select onChange={e => setElevationBasedOn(e.target.value)}>
            <option value=''>None</option>
            {Object.keys(metrics).map(key => <option key={key} selected={key === elevationBasedOn}>{key}</option>)}
          </select>
        </div>
      </div>
      <Map
        layers={layers}
        showLegend={showLegend}
        position={legendPosition}
        legends={legends}
      />
    </div>
  )
}

HexLayerMap.propTypes = propTypes
HexLayerMap.defaultProps = defaultProps

export default HexLayerMap
