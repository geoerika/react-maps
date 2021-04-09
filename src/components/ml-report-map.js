import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import {
  commonProps,
  commonDefaultProps,
  typographyPropTypes,
  typographyDefaultProps,
  tooltipPropTypes,
  tooltipDefaultProps,
} from '../shared/map-props'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import { setView, setFinalLayerDataAccessor } from '../shared/utils'
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
  radiusBasedOn: PropTypes.string,
  radiusDataScale: PropTypes.string,
  radii: PropTypes.array,
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
  showTooltip: PropTypes.bool,
}

const defaultProps = {
  centerMap: {}, // { lat, lon }
  // highlightId: undefined,
  getTooltip: undefined,
  customOnClick: undefined,
  onHover: undefined,
  getCursor: undefined,
  opacity: 1,
  radiusBasedOn: '',
  radiusDataScale: 'linear',
  radii: [5, 50],
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
  showTooltip: false,
}

const MLReportMap = ({
  reportData,
  // centerMap,
  // highlightId,
  // Deck Map props
  getTooltip,
  // Deck Layer Props
  onClick,
  onHover,
  getCursor,
  opacity,
  radiusBasedOn,
  radiusDataScale,
  radii,
  getRadius,
  getFillColor,
  fillBasedOn,
  fillDataScale,
  fillColors,
  getLineWidth,
  getLineColor,
  showTooltip,
  tooltipProps,
  typography,
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

  // useEffect(() => {
  //   // zoom to a point
  //   if (width && height) {
  //     setViewOverride(o => ({
  //       ...o,
  //       ...centerMap,
  //     }))
  //   }
  // }, [centerMap, height, width])

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

  const layers = useMemo(() => {
    return [
      Scatter({
        id: `${reportData[0]?.report_id || 'generic'}-report-scatterplot-layer`,
        data: reportData,
        getPosition: d => [d.lon, d.lat],
        pickable: Boolean(onClick || onHover || getTooltip || getCursor),
        onClick: finalOnClick,
        opacity,
        getRadius: setFinalLayerDataAccessor({
          dataKey: radiusBasedOn,
          getLayerProp: getRadius,
          layerDataScale: radiusDataScale,
          layerPropRange: radii,
          metrics,
        }),
        getFillColor: setFinalLayerDataAccessor({
          dataKey: fillBasedOn,
          getLayerProp: getFillColor,
          layerDataScale: fillDataScale,
          layerPropRange: fillColors,
          metrics,
          highlightId,
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
    radiusBasedOn,
    radiusDataScale,
    radii,
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
      onHover={onHover}
      viewStateOverride={viewStateOverride}
      showTooltip={showTooltip}
      tooltipProps={tooltipProps}
      // tooltipNode={<EntryList {...tooltip} />}
      typography={typography}
      mapboxApiAccessToken={mapboxApiAccessToken}
      // x, y, translate
    />
  )
}

MLReportMap.propTypes = {
  ...propTypes,
  ...commonProps,
  ...typographyPropTypes,
  ...tooltipPropTypes,
}
MLReportMap.defaultProps = {
  ...defaultProps,
  ...commonDefaultProps,
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
}

export default MLReportMap
