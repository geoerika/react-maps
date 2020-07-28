import React, { useState, useEffect, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'

import { GeoJsonLayer } from 'deck.gl'

import Map from './generic-map'
import { intensityByMetric, colorIntensityByMetric } from '../utils'


const propTypes = {
  radiusBasedOn: PropTypes.string,
  defaultFillBasedOn: PropTypes.string,
  defaultElevationBasedOn: PropTypes.string,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  opacity: PropTypes.number,
  getRadius: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
  ]),
  radiusUnits: PropTypes.string,
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
  defaultKeyMetric: PropTypes.string,
}

const defaultProps = {
  radiusBasedOn: '',
  defaultFillBasedOn: '',
  defaultElevationBasedOn: '',
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
  extruded: false,
  getElevation: 0,
  // lineWidthUnits,
  // lineWidthMinPixels: 1,
  // lineWidthMaxPixels: 10,
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 2,
  getLineColor: [0, 0, 0],
  showLegend: false,
  legendPosition: 'top-left',
}

const GeoJsonMap = ({
  radiusBasedOn,
  defaultFillBasedOn,
  defaultElevationBasedOn,
  onClick,
  onHover,
  opacity,
  getElevation,
  getRadius,
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

  // TODO: multiplier & base values through props
  const finalGetRadius = useMemo(() => radiusBasedOn.length ? intensityByMetric({
    multiplier: 40,
    base: 8,
    metric: radiusBasedOn,
    metricStats: metrics[radiusBasedOn] || {}, // max & min
  }) : getRadius, [radiusBasedOn, getRadius, metrics])

  const finalGetFillColor = useMemo(() => fillBasedOn ? colorIntensityByMetric({
    color: [{ base: 100, multiplier: 155 }, { base: 0, multiplier: 0 }, { base: 0, multiplier: 0 }, { base: 255, multiplier: 0 }],
    metric: fillBasedOn,
    getDataObject: d => ((d || { properties: {} }).properties || {}),
    metricStats: metrics[fillBasedOn] || {}, // max & min
  }) : getFillColor, [fillBasedOn, getFillColor, metrics])

  const finalGetElevation = useMemo(() => elevationBasedOn.length ? intensityByMetric({
    multiplier: 1000000,
    base: 100000,
    metric: elevationBasedOn,
    getDataObject: d => d.properties,
    metricStats: metrics[elevationBasedOn] || {}, // max & min
  }) : getElevation, [elevationBasedOn, getElevation, metrics])

  const layers = useMemo(() => ([
    new GeoJsonLayer({
      id: `xyz-geojson-scatterplot-layer`,
      data,
      pickable: onClick || onHover,
      onClick,
      onHover,
      opacity,
      getRadius: finalGetRadius,
      getFillColor: finalGetFillColor,
      getElevation: finalGetElevation,
      getLineWidth,
      getLineColor,
      updateTriggers: {
        getFillColor: [finalGetFillColor],
      },
      ...geoJsonLayerProps,
    })
  ]), [
    geoJsonLayerProps,
    data,
    onClick,
    onHover,
    finalGetElevation,
    finalGetRadius,
    finalGetFillColor,
    getLineColor,
    getLineWidth,
    opacity,
  ])

  const legends = useMemo(() => {
    let legends = undefined
    if (fillBasedOn.length) {
      if (!legends) legends = []
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
      if (!legends) legends = []
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
    // TODO: elevation legend
    return legends
  }, [radiusBasedOn, fillBasedOn, metrics])

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
