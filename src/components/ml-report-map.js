import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import { commonProps, commonDefaultProps } from '../shared/map-props'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import { setView, getFinalFillColor } from '../shared/utils'
import { useMapData } from '../hooks'


const propTypes = {
  reportData: PropTypes.array.isRequired,
  centerMap: PropTypes.object,
  highlightId: PropTypes.number,
  getTooltip: PropTypes.func,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  getCursor: PropTypes.func,
  opacity: PropTypes.number,
  getRadius: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
  ]),
  radiusUnits: PropTypes.string,
  filled: PropTypes.bool,
  fillBasedOn: PropTypes.string,
  fillDataScale: PropTypes.string,
  fillColors: PropTypes.array,
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
}

const defaultProps = {
  centerMap: {}, // { lat, lon }
  // highlightId: undefined,
  getTooltip: undefined,
  customOnClick: undefined,
  onHover: undefined,
  getCursor: undefined,
  opacity: 1,
  getRadius: 10,
  radiusUnits: 'pixels',
  filled: true,
  fillBasedOn: '',
  fillDataScale: 'linear',
  fillColors: [[221, 25, 107], [0, 98, 217]],
  getFillColor: highlightId => d => d.poi_id === highlightId ? [221, 25, 107] : [0, 98, 217],
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 2,
  getLineColor: [255, 255, 255],
}

const MLReportMap = ({
  reportData,
  centerMap,
  // highlightId,
  // Deck Map props
  getTooltip,
  // Deck Layer Props
  onClick,
  onHover,
  getCursor,
  opacity,
  getRadius,
  getFillColor,
  fillBasedOn,
  fillDataScale,
  fillColors,
  getLineWidth,
  getLineColor,
  mapboxApiAccessToken,
  ...scatterLayerProps
}) => {
  const [viewStateOverride, setViewOverride] = useState({})
  const [highlightId, setHighlightId] = useState(0)
  const [{ height, width }, setDimensions] = useState({})

  useEffect(() => {
    if (width && height) {
      // recenter based on data
      const dataView = setView({ data: reportData, width, height })
      setViewOverride(o => ({
        ...o,
        ...dataView,
      }))
    }
  }, [reportData, height, width])

  useEffect(() => {
    // zoom to a point
    if (width && height) {
      setViewOverride(o => ({
        ...o,
        ...centerMap,
      }))
    }
  }, [centerMap, height, width])

  /**
   * finalOnClick - React hook that handles default onClick event
   * @param { object } param - object of deck.gl click event
   * @param { object } param.object - clicked object on map
   */
  const finalOnClick = useCallback(({ object }) => {
    if (onClick) {
      onClick(object)
    } else if (object) {
      const { lat, lon } = object
      // correct way to center map on clicked point; don't use 'coordinate' from onClick event
      const [longitude, latitude] = [lon, lat]
      setHighlightId(object.poi_id)
      setViewOverride({ longitude, latitude, zoom: 14 })
    }
  }, [onClick])

  useEffect(() => {
    if (reportData.length) {
      metricDispatch({ type: 'data', payload : reportData })
    }
  }, [metricDispatch, reportData])

  const { metrics, metricDispatch } = useMapData({
    dataAccessor: d => d,
    dataPropertyAccessor: d => d,
  })

  console.log('metrics: ', metrics)
  const layers = useMemo(() => {
    return [
      Scatter({
        id: `${reportData[0]?.report_id || 'generic'}-report-scatterplot-layer`,
        data: reportData,
        getPosition: d => [d.lon, d.lat],
        pickable: Boolean(onClick || onHover || getTooltip || getCursor),
        onClick: finalOnClick,
        onHover,
        opacity,
        getRadius,
        getFillColor: getFinalFillColor({
          fillBasedOn,
          getFillColor,
          fillDataScale,
          fillColors,
          metrics,
          highlightId,
          dataPropertyAccessor: d => d,
        }),
        getLineWidth,
        getLineColor,
        getTooltip,
        updateTriggers: {
          getRadius: [getRadius],
          getFillColor: [getFillColor, highlightId],
          getLineWidth: [getLineWidth],
          getLineColor: [getLineColor],
        },
        ...scatterLayerProps,
      }),
    ]
  }, [
    reportData,
    highlightId,
    onClick,
    finalOnClick,
    onHover,
    getCursor,
    opacity,
    getRadius,
    fillBasedOn,
    getFillColor,
    fillDataScale,
    fillColors,
    metrics,
    getLineWidth,
    getLineColor,
    getTooltip,
    scatterLayerProps,
  ])

  return (
    <Map
      layers={layers}
      setDimensionsCb={(o) => setDimensions(o)}
      getTooltip={getTooltip}
      getCursor={getCursor}
      viewStateOverride={viewStateOverride}
      mapboxApiAccessToken={mapboxApiAccessToken}
      // x, y, translate
    />
  )
}

MLReportMap.propTypes = { ...propTypes, ...commonProps }
MLReportMap.defaultProps = { ...defaultProps, ...commonDefaultProps }

export default MLReportMap
