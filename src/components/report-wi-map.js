import React, { useState, useEffect, useReducer, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { color } from 'd3-color'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import EntryList from './entry-list'
import { intensityByMetric, colorIntensityByMetric } from '../utils'
import { reportWI } from '../datasets'


const propTypes = {
  getReport: PropTypes.func.isRequired,
  report_id: PropTypes.number.isRequired,
  layer_id: PropTypes.number.isRequired,
  map_id: PropTypes.number.isRequired,
  radiusBasedOn: PropTypes.string,
  radiusDataScale: PropTypes.string,
  radii: PropTypes.array,
  fillBasedOn: PropTypes.string,
  fillDataScale: PropTypes.string,
  fillColors: PropTypes.array,
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
  useTooltip: PropTypes.bool,
}

const defaultProps = {
  radiusBasedOn: '',
  radiusDataScale: 'linear',
  radii: [5, 50],
  fillBasedOn: '',
  fillDataScale: 'linear',
  fillColors: [interpolateBlues(0), interpolateBlues(1)],
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
  useTooltip: false,
}

const SCALES = {
  'linear': scaleLinear,
  'quantile': scaleQuantile,
  'quantize': scaleQuantize,
}

// DeckGL react component
const ReportWIMap = ({
  getReport,
  report_id,
  layer_id,
  map_id,
  radiusBasedOn,
  radiusDataScale,
  radii,
  fillBasedOn,
  fillDataScale,
  fillColors,
  onClick,
  onHover,
  opacity,
  getRadius,
  getFillColor,
  getLineWidth,
  getLineColor,
  showLegend,
  legendPosition,
  useTooltip,
  ...scatterLayerProps
}) => {
  const [layers, setLayers] = useState([])
  const [tooltip, tooltipDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'show') {
      // TODO: for a click event, any movement of the map will cause the tooltip to be out of place
      // 1) close on these events
      // 2) keep the lat/lon and convert to x/y
      const { x, y, object } = payload
      return {
        ...state,
        // toggle clicked object
        show: !state.object || state.object.poi_id !== object.poi_id,
        x,
        y,
        object,
      }
    }
   }, { show: false, translate: true })

  const finalOnClick = useCallback((o) => {
    if (onClick) {
      onClick(o)
    }
    if (useTooltip) {
      tooltipDispatch({ type: 'show', payload: o })
    }
  }, [onClick, useTooltip])

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

      return {
        data: payload,
        metrics,
      }
    }

    // default
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
      // TODO: these values through props
      const finalGetRadius = radiusBasedOn.length ? intensityByMetric({
        multiplier: 40,
        base: 8,
        metric: radiusBasedOn,
        data: reportData,
      }) : getRadius
      const finalGetFillColor = fillBasedOn.length ? colorIntensityByMetric({
        color: [{ base: 100, multiplier: 155 }, { base: 0, multiplier: 0 }, { base: 0, multiplier: 0 }, { base: 255, multiplier: 0 }],
        metric: fillBasedOn,
        data: reportData,
      }) : getFillColor
      setLayers([
        Scatter({
          id: `${report_id}-report-scatterplot-layer`,
          data: reportData,
          getPosition: d => [d.lon, d.lat],
          pickable: (onClick || useTooltip) || onHover,
          onClick: finalOnClick,
          onHover,
          opacity,
          getRadius: finalGetRadius,
          getFillColor: finalGetFillColor,
          getLineWidth,
          getLineColor,
          ...scatterLayerProps,
        })
      ])
    }
    getData()
  }, [getReport, report_id, layer_id, map_id])

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
    let finalGetRadius = getRadius
    if (radiusBasedOn.length) {
      const d3Fn = SCALES[radiusDataScale]([
        (metrics[radiusBasedOn] || { min: 0 }).min,
        (metrics[radiusBasedOn] || { max: 10 }).max
      ], radii)

      finalGetRadius = d => d3Fn(d[radiusBasedOn])
    } 
    
    let finalGetFillColor = getFillColor
    if (fillBasedOn.length) {
      const d3Fn = SCALES[fillDataScale]([
        (metrics[fillBasedOn] || { min: 0 }).min,
        (metrics[fillBasedOn] || { max: 10 }).max
      ], fillColors)

      finalGetFillColor = d => {
        const ret = color(d3Fn(d[fillBasedOn]))
        return [ret.r, ret.g, ret.b]
      }
    } 

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
  }, [
    report_id,
    scatterLayerProps,
    data,
    metrics,
    onClick,
    onHover,
    radiusBasedOn,
    radiusDataScale,
    radii,
    fillBasedOn,
    fillColors,
    fillDataScale,
    getFillColor,
    getLineColor,
    getLineWidth,
    getRadius,
    opacity,
  ])

  const legends = useMemo(() => {
    const legends = []
    if (fillBasedOn.length) {
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
  }, [radiusBasedOn, fillBasedOn, fillColors, metrics])

  return (
    <Map
      layers={layers}
      showLegend={showLegend}
      position={legendPosition}
      legends={legends}
      showTooltip={tooltip.show}
      tooltipNode={<EntryList {...tooltip} />}
      // x, y, translate
      {...tooltip}
    />
  )
}

ReportWIMap.propTypes = propTypes
ReportWIMap.defaultProps = defaultProps

export default ReportWIMap
