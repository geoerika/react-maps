import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { commonProps, commonDefaultProps } from '../shared/map-props'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import { setView } from '../shared/utils'


const propTypes = {
  reportData: PropTypes.array.isRequired,
  centerMap: PropTypes.object,
  highlightId: PropTypes.number,
  getTooltip: PropTypes.func,
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
}

const defaultProps = {
  centerMap: {}, // { lat, lon }
  highlightId: undefined,
  getTooltip: undefined,
  onClick: undefined,
  onHover: undefined,
  opacity: 0.8,
  getRadius: 10,
  radiusUnits: 'pixels',
  filled: true,
  getFillColor: highlight_id => d => d.poi_id === highlight_id ? [0, 0, 255] : [0, 0, 150],
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 2,
  getLineColor: [255, 255, 255],
}

const MLReportMap = ({
  reportData,
  centerMap,
  highlightId,
  // Deck Map props
  getTooltip,
  // Deck Layer Props
  onClick,
  onHover,
  opacity,
  getRadius,
  getFillColor,
  getLineWidth,
  getLineColor,
  mapboxApiAccessToken,
  ...scatterLayerProps
}) => {

  const [viewStateOverride, setViewOverride] = useState({})
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

  const layers = useMemo(() => {
    return [
      Scatter({
        id: `${reportData[0]?.report_id || 'generic'}-report-scatterplot-layer`,
        data: reportData,
        getPosition: d => [d.lon, d.lat],
        pickable: onClick || onHover || getTooltip,
        onClick,
        onHover,
        opacity,
        getRadius,
        getFillColor: getFillColor(highlightId),
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
    onHover,
    opacity,
    getRadius,
    getFillColor,
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
      viewStateOverride={viewStateOverride}
      mapboxApiAccessToken={mapboxApiAccessToken}
      // x, y, translate
    />
  )
}

MLReportMap.propTypes = { ...propTypes, ...commonProps }
MLReportMap.defaultProps = { ...defaultProps, ...commonDefaultProps }

export default MLReportMap
