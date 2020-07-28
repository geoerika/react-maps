import React, { useEffect, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'

import { GeoJsonLayer } from 'deck.gl'

import Map from './generic-map'
import { intensityByMetric, colorIntensityByMetric } from '../utils'

import geoJsonData from './vwi-geojson'


const propTypes = {
  radiusBasedOn: PropTypes.string,
  fillBasedOn: PropTypes.string,
  elevationBasedOn: PropTypes.string,
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
  fillBasedOn: '',
  elevationBasedOn: '',
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
  fillBasedOn,
  elevationBasedOn,
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

  const [{ data, metrics }, metricDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'data') {
      // calculate all min and max
      // { [key]: { max, min }}
      const DATA_FIELDS = Object.entries(payload.features[0].properties)
        .filter(([_, v]) => typeof v === 'number')
        .map(([k, _]) => k)
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

  useEffect(() => {
    const getData = async () => {
      // TODO pull this data
      // const reportData = await getReport({ report_id, layer_id, map_id })
      await setTimeout(() => {}, 2000)
      metricDispatch({ type: 'data', payload: geoJsonData })
    }
    getData()
  }, [])

  const layers = useMemo(() => {
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
      getDataObject: d => d.properties,
      ...metrics[fillBasedOn], // max & min
    }) : getFillColor
    const finalGetElevation = elevationBasedOn.length ? intensityByMetric({
      multiplier: 1000000,
      base: 100000,
      metric: elevationBasedOn,
      getDataObject: d => d.properties,
      ...metrics[elevationBasedOn], // max & min
    }) : getElevation

    return [
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
        ...geoJsonLayerProps,
      })
    ]
  }, [geoJsonLayerProps, data, metrics, onClick, onHover, radiusBasedOn, fillBasedOn, getFillColor, getLineColor, getLineWidth, getRadius, opacity])

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
    // TODO: elevation legend
    return legends
  }, [radiusBasedOn, fillBasedOn, metrics])

  return (
    <Map
      layers={layers}
      showLegend={showLegend}
      position={legendPosition}
      legends={legends}
    />
  )
}

GeoJsonMap.propTypes = propTypes
GeoJsonMap.defaultProps = defaultProps

export default GeoJsonMap
