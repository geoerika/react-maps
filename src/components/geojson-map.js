import React, { useState, useEffect, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'

import { GeoJsonLayer } from 'deck.gl'

import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { color } from 'd3-color'

import Map from './generic-map'


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
  elevations: [0, 1000000],
  onClick: undefined,
  onHover: undefined,
  opacity: 0.8,
  filled: true,
  getFillColor: [255, 140, 0],
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

const GeoJsonMap = ({
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
  ...geoJsonLayerProps
}) => {
  const [geoJson, setGeoJson] = useState('')
  const handleSetData = () => {
    try {
      const payload = JSON.parse(geoJson)
      // basic validation
      if (payload.type === 'FeatureCollection' && payload.features[0]) {
        metricDispatch({ type: 'data', payload })
      }
    } catch (e) {
      console.warn('Not Valid JSON')
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
  // TODO this entire file is very similar to the report-wi-map, except different data source
  // and slightly different processing of datasets
  const [{ data, metrics }, metricDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'data') {
      // calculate all min and max
      // { [key]: { max, min }}
      const DATA_FIELDS = Object.entries(payload.features[0].properties)
        .filter(entry => typeof entry[1] === 'number')
        .map(([k]) => k)
      const metrics =  payload.features.reduce((agg, { properties }) => ({
        ...DATA_FIELDS
          .reduce((rowAgg, key) => ({
            ...rowAgg,
            [key]: {
              max: Math.max((agg[key] || { max: null }).max, properties[key]),
              min: Math.min((agg[key] || { min: null }).min, properties[key]),
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
        const ret = color(d3Fn(d.properties[fillBasedOn]))
        return [ret.r, ret.g, ret.b]
      }
    }
    return getFillColor
  }, [fillBasedOn, fillDataScale, fillColors, getFillColor, metrics])

  const finalGetElevation = useMemo(() => {
    if (elevationBasedOn.length) {
      const d3Fn = SCALES[elevationDataScale]([
        (metrics[elevationBasedOn] || { min: 0 }).min,
        (metrics[elevationBasedOn] || { max: 10 }).max
      ], elevations)
      return d => d3Fn(d.properties[elevationBasedOn])
    }
    return getElevation
  }, [elevationBasedOn, elevationDataScale, elevations, getElevation, metrics])

  const layers = useMemo(() => ([
    new GeoJsonLayer({
      id: `xyz-scatterplot-layer`,
      data,
      pickable: onClick || onHover,
      onClick,
      onHover,
      opacity,
      extruded: elevationBasedOn.length,
      getFillColor: finalGetFillColor,
      getElevation: finalGetElevation,
      getLineWidth,
      getLineColor,
      updateTriggers: {
        getFillColor: [finalGetFillColor, fillDataScale, fillColors],
      },
      ...geoJsonLayerProps,
    })
  ]), [
    geoJsonLayerProps,
    data,
    onClick,
    onHover,
    elevationBasedOn,
    finalGetElevation,
    finalGetFillColor,
    fillColors,
    fillDataScale,
    getLineColor,
    getLineWidth,
    opacity,
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
        <button onClick={handleSetData}>Load GeoJSON</button>
        <textarea onChange={e => setGeoJson(e.target.value)}/>
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

GeoJsonMap.propTypes = propTypes
GeoJsonMap.defaultProps = defaultProps

export default GeoJsonMap
