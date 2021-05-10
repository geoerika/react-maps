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
import Legend from './legend'
import MapTooltip from './tooltip'
import tooltipNode from './tooltip/tooltip-node'
import {
  setView,
  setFinalLayerDataAccessor,
  getArrayFillColors,
  getStrFillColor,
  getArrayGradientFillColors,
  setLegendOpacity,
} from '../shared/utils'
import { useMapData, useLegends } from '../hooks'


const propTypes = {
  reportData: PropTypes.array.isRequired,
  // centerMap: PropTypes.object,
  // highlightId: PropTypes.number,
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
    PropTypes.func,
  ]),
  getLineColor: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  opacity: PropTypes.number,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.string,
  legendNode: PropTypes.node,
  getTooltip: PropTypes.func,
  showTooltip: PropTypes.bool,
  tooltipNode: PropTypes.func,
  getCursor: PropTypes.func,
  dataAccessor: PropTypes.func,
  dataPropertyAccessor: PropTypes.func,
  pitch: PropTypes.number,
  formatLegendTitle: PropTypes.func,
  formatTooltipTitle: PropTypes.func,
  formatPropertyLabel: PropTypes.func,
  formatData: PropTypes.object,
}

const defaultProps = {
  // centerMap: {}, // { lat, lon }
  // highlightId: undefined,
  radiusBasedOn: '',
  radiusDataScale: 'linear',
  radii: [5, 50],
  getRadius: 10,
  radiusUnits: 'pixels',
  filled: true,
  // legend only works with string colour format, hex or rgba
  // for deck.gl layers we need to convert color strings in arrays of [r, g, b, a, o]
  fillBasedOn: '',
  fillDataScale: 'linear',
  fillColors: ['#bae0ff', '#0075ff'],
  getFillColor: highlightId => d => d?.GeoCohortItem === highlightId ? [255, 138, 0] : [0, 117, 255],
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 1,
  getLineColor: [34, 66, 205],
  opacity: 0.5,
  onClick: undefined,
  onHover: undefined,
  showLegend: false,
  legendPosition: 'top-left',
  legendNode: undefined,
  getTooltip: undefined,
  showTooltip: false,
  tooltipNode: tooltipNode,
  getCursor: undefined,
  dataAccessor: d => d,
  dataPropertyAccessor: d => d,
  formatLegendTitle: d => d,
  formatTooltipTitle: d => d,
  formatPropertyLabel: d => d,
  formatData: undefined,
}

const QLReportMap = ({
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
  tooltipNode,
  tooltipKeys,
  typography,
  showLegend,
  legendPosition,
  legendNode,
  dataAccessor,
  dataPropertyAccessor,
  formatLegendTitle,
  formatTooltipTitle,
  formatPropertyLabel,
  formatData,
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
   * finalOnClick - React hook that handles layer's onClick events
   * @param { object } param
   * @param { object } param.object - clicked object on the map
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

  // set metrics and metricDispatch
  const { metrics, metricDispatch } = useMapData({
    dataAccessor,
    dataPropertyAccessor,
  })

  useEffect(() => {
    if (reportData.length) {
      metricDispatch({ type: 'data', payload : reportData })
    }
  }, [metricDispatch, reportData])

  /**
   * finalTooltipKeys - React hook that returns an object of keys for map's Tooltip component
   * @returns { Node } - object of keys { name, id, metricKeys }
   */
  const finalTooltipKeys = useMemo(() => {
    const { name, id } = tooltipKeys
    let metricKeysArray = tooltipKeys?.metricKeys || []
    // set metricKeys array if no custom keys are given
    if (showTooltip && !tooltipKeys?.metricKeys?.length) {
      ([radiusBasedOn, fillBasedOn]).forEach((key) => {
        if (key) {
          metricKeysArray.push(key)
        }
      })
    }
    return {
      ...tooltipKeys,
      name: name || 'name',
      id: id || 'poi_id',
      metricKeys: metricKeysArray,
    }
  }, [showTooltip, tooltipKeys, radiusBasedOn, fillBasedOn])

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
          dataPropertyAccessor,
          getLayerProp: getRadius,
          layerDataScale: radiusDataScale,
          layerPropRange: radii,
          metrics,
        }),
        getFillColor: setFinalLayerDataAccessor({
          dataKey: fillBasedOn,
          dataPropertyAccessor,
          getLayerProp: getFillColor,
          layerDataScale: fillDataScale,
          // we need to convert string format color (used in legend) to array format color for deck.gl
          layerPropRange: getArrayFillColors({ fillColors }),
          highlightId,
          metrics,
        }),
        getLineWidth,
        getLineColor,
        getTooltip,
        updateTriggers: {
          getRadius: [
            radiusBasedOn,
            dataPropertyAccessor,
            getRadius,
            radiusDataScale,
            radii,
            metrics,
          ],
          getFillColor: [
            fillBasedOn,
            dataPropertyAccessor,
            getFillColor,
            fillDataScale,
            fillColors,
            highlightId,
            metrics,
          ],
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
    dataPropertyAccessor,
  ])

  // prepare list of legends with used parameteres
  const legends = useLegends({
    radiusBasedOn,
    fillBasedOn,
    /**
     * We convert an array of string format colors, into an array of rgba string format colours so we
     * can use them in the Legend Gradient component
     *
     * There is visually a difference between the legend opacity for color gradient and map opacity,
     * we need to adjust opacity for symbols in the legend to have a closer match
     */
    fillColors: getArrayGradientFillColors({ fillColors, opacity: setLegendOpacity({ opacity }) }),
    // convert array format color (used in deck.gl elevation fill) into str format color for legend
    objColor: getStrFillColor({ fillColor: getFillColor, opacity: setLegendOpacity({ opacity }) }),
    metrics,
  })

  // set legend element
  const legend = useMemo(() => {
    const { metricAliases } = tooltipKeys
    return (
      showLegend &&
      (legendNode ||
        (legends?.length > 0 &&
          <Legend
            legends={legends}
            fillBasedOn={fillBasedOn}
            metricAliases={metricAliases}
            formatLegendTitle={formatLegendTitle}
            formatPropertyLabel={formatPropertyLabel}
            formatData={formatData}
            position={legendPosition}
            typograpy={typography}
            symbolLineColor={
              (typeof getLineColor !== 'function') ?
                getStrFillColor({ fillColor: getLineColor, opacity: setLegendOpacity({ opacity }) }) :
                ''
            }
          />
        )
      )
    )}, [
    showLegend,
    legends,
    fillBasedOn,
    tooltipKeys,
    legendPosition,
    formatLegendTitle,
    formatPropertyLabel,
    formatData,
    typography,
    legendNode,
    getLineColor,
    opacity,
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
      renderTooltip={({ hoverInfo }) => (
        <MapTooltip
          info={hoverInfo}
          tooltipProps={tooltipProps}
          typography={typography}
        >
          {tooltipNode({
            tooltipKeys: finalTooltipKeys,
            formatData,
            formatTooltipTitle,
            formatPropertyLabel,
            params: hoverInfo.object,
          })}
        </MapTooltip>
      )}
      legend={legend}
      mapboxApiAccessToken={mapboxApiAccessToken}
      // x, y, translate
    />
  )
}

QLReportMap.propTypes = {
  ...propTypes,
  ...commonProps,
  ...typographyPropTypes,
  ...tooltipPropTypes,
}
QLReportMap.defaultProps = {
  ...defaultProps,
  ...commonDefaultProps,
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
}

export default QLReportMap
