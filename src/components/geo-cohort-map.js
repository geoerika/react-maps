import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { GeoJsonLayer } from '@deck.gl/layers'
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
  fillBasedOn: PropTypes.string,
  fillDataScale: PropTypes.string,
  fillColors: PropTypes.array,
  elevationBasedOn: PropTypes.string,
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
  legendNode: PropTypes.node,
  reportData: PropTypes.array.isRequired,
  // highlightId: PropTypes.number,
  getCursor: PropTypes.func,
  getTooltip: PropTypes.func,
  showTooltip: PropTypes.bool,
  tooltipNode: PropTypes.func,
  dataAccessor: PropTypes.func,
  dataPropertyAccessor: PropTypes.func,
  pitch: PropTypes.number,
  formatLegendTitle: PropTypes.func,
  formatTooltipTitle: PropTypes.func,
  formatPropertyLabel: PropTypes.func,
  formatData: PropTypes.object,
  setZoom: PropTypes.func,
  setViewportBBox: PropTypes.func,
}

const defaultProps = {
  fillBasedOn: '',
  fillDataScale: 'linear',
  fillColors: ['#bae0ff', '#0075ff'],
  elevationBasedOn: '',
  elevationDataScale: 'linear',
  elevations: [0, 1000],
  onClick: undefined,
  onHover: undefined,
  opacity: 0.5,
  filled: true,
  getFillColor: highlightId => d => d?.GeoCohortItem === highlightId ? [255, 138, 0] : [0, 117, 255],
  getElevation: 0,
  stroked: true,
  lineWidthUnits: 'pixels',
  getLineWidth: 1,
  getLineColor: [34, 66, 205],
  showLegend: false,
  legendPosition: 'top-left',
  legendNode: undefined,
  getTooltip: undefined,
  showTooltip: false,
  tooltipNode: tooltipNode,
  getCursor: undefined,
  pitch: 0,
  dataAccessor: d => d,
  dataPropertyAccessor: d => d,
  formatLegendTitle: d => d,
  formatTooltipTitle: d => d,
  formatPropertyLabel: d => d,
  formatData: undefined,
  setZoom: () => {},
  setViewportBBox: () => {},
}

const GeoCohortMap = ({
  reportData,
  filled,
  stroked,
  fillBasedOn,
  fillDataScale,
  fillColors,
  elevationBasedOn,
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
  legendNode,
  getCursor,
  getTooltip,
  showTooltip,
  tooltipProps,
  tooltipNode,
  tooltipKeys,
  typography,
  pitch,
  dataAccessor,
  dataPropertyAccessor,
  formatLegendTitle,
  formatTooltipTitle,
  formatPropertyLabel,
  formatData,
  setZoom,
  setViewportBBox,
  mapboxApiAccessToken,
  ...geoJsonLayerProps
}) => {
  const [viewStateOverride, setViewOverride] = useState({})
  const [highlightObj, setHighlightObj] = useState(null)
  const [{ height, width }, setDimensions] = useState({})

  useEffect(() => {
    if (width && height) {
      // recenter based on clicked obj or data
      const dataView = highlightObj ?
        setView({ data: [highlightObj], width, height }) :
        setView({ data: reportData, width, height })
      // TO DO  - resolve this so it is not so particular to our maps
      // only adjust viewport to data for FSAs
      if (!highlightObj && reportData[0]?.GeoCohortItem?.length === 3) {
        setViewOverride(o => ({
          ...o,
          ...dataView,
        }))
      }
    }
  }, [highlightObj, reportData, height, width])

  /**
   * finalOnClick - React hook that handles layer's onClick events
   * @param { object } param
   * @param { object } param.object - clicked object on the map
   */
  const finalOnClick = useCallback(({ object }) => {
    if (typeof onClick === 'function') {
      onClick(object)
    } else if (object?.type) {
      // recenter and zoom on the clicked element
      const dataView = setView({ data: [object], width, height })
      setViewOverride(o => ({
        ...o,
        ...dataView,
      }))
      setHighlightObj(object)
    }
  }, [onClick, width, height])

  // set metrics and metricDispatch
  const { metrics, metricDispatch } = useMapData({
    dataAccessor,
    dataPropertyAccessor,
  })

  useEffect(() => {
    if (reportData?.length) {
      metricDispatch({ type: 'data', payload : reportData })
    }
    // reset highlightObj when we get new reportData
    setHighlightObj(null)
  }, [metricDispatch, reportData])

  /**
   * finalTooltipKeys - React hook that returns an object of keys for map's Tooltip component
   * @returns { object } - object of tooltip keys
   * { name, id, metricKeys, metricAliases, nameAccessor, idAccessor, metricAccessor}
   */
  const finalTooltipKeys = useMemo(() => {
    const { name, nameAccessor } = tooltipKeys
    let metricKeysArray = tooltipKeys?.metricKeys || []
    // set metricKeys array if no custom keys are given
    if (showTooltip && !tooltipKeys?.metricKeys) {
      ([elevationBasedOn, fillBasedOn]).forEach((key) => {
        if (key) {
          metricKeysArray.push(key)
        }
      })
    }
    return {
      ...tooltipKeys,
      name: name || 'GeoCohortItem',
      nameAccessor: nameAccessor || dataPropertyAccessor,
      metricKeys: metricKeysArray,
      metricAccessor: dataPropertyAccessor,
    }
  }, [showTooltip, tooltipKeys, elevationBasedOn, fillBasedOn, dataPropertyAccessor])

  // set layer configuration for the map
  const layers = useMemo(() => {
    const highlightId = highlightObj?.GeoCohortItem
    return [
      new GeoJsonLayer({
        id: 'geo-cohort-geojson-layer',
        data: reportData,
        pickable: Boolean(onClick || onHover || getTooltip || getCursor),
        stroked,
        onClick: finalOnClick,
        opacity,
        extruded: elevationBasedOn.length,
        filled,
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
        getElevation: setFinalLayerDataAccessor({
          dataKey: elevationBasedOn,
          dataPropertyAccessor,
          getLayerProp: getElevation,
          layerDataScale: elevationDataScale,
          layerPropRange: elevations,
          metrics,
        }),
        getLineWidth,
        getLineColor,
        updateTriggers: {
          getFillColor: [
            fillBasedOn,
            dataPropertyAccessor,
            getFillColor,
            fillDataScale,
            fillColors,
            highlightId,
            metrics,
          ],
          getElevation: [
            elevationBasedOn,
            dataPropertyAccessor,
            getElevation,
            elevationDataScale,
            elevations,
            metrics,
          ],
          getLineWidth: [getLineWidth],
          getLineColor: [getLineColor],
        },
        ...geoJsonLayerProps,
      }),
    ]}, [
    geoJsonLayerProps,
    reportData,
    metrics,
    highlightObj,
    onClick,
    finalOnClick,
    onHover,
    elevationBasedOn,
    elevationDataScale,
    elevations,
    filled,
    stroked,
    fillBasedOn,
    fillDataScale,
    fillColors,
    getElevation,
    getFillColor,
    getLineColor,
    getLineWidth,
    opacity,
    getCursor,
    getTooltip,
    dataPropertyAccessor,
  ])

  // prepare list of legends with used parameteres
  const legends = useLegends({
    elevationBasedOn,
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
      setHighlightObj={setHighlightObj}
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
      pitch={pitch}
      setZoom={setZoom}
      setViewportBBox={setViewportBBox}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  )
}

GeoCohortMap.propTypes = {
  ...propTypes,
  ...commonProps,
  ...tooltipPropTypes,
  ...typographyPropTypes,
}
GeoCohortMap.defaultProps = {
  ...defaultProps,
  ...commonDefaultProps,
  ...tooltipDefaultProps,
  ...typographyDefaultProps,
}

export default GeoCohortMap
