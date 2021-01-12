import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { commonProps, commonDefaultProps } from '../shared/map-props'

import { HexagonLayer } from 'deck.gl'

import { interpolateBlues } from 'd3-scale-chromatic'
import { color } from 'd3-color'

import { useMapData, useLegends } from '../hooks'
import Map from './generic-map'
import Loader, { convertCSVtoJSON } from './loader'


const propTypes = {
  fillBasedOnInit: PropTypes.string,
  fillColors: PropTypes.array,
  elevationBasedOnInit: PropTypes.string,
  elevations: PropTypes.array,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  opacity: PropTypes.number,
  getColorWeight: PropTypes.func,
  getElevationWeight: PropTypes.func,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.string,
}

const defaultProps = {
  fillBasedOnInit: '',
  fillColors: [interpolateBlues(0), interpolateBlues(1)],
  elevationBasedOnInit: '',
  elevations: [0, 10000],
  onClick: undefined,
  onHover: undefined,
  opacity: 0.8,
  getColorWeight: () => 1,
  getElevationWeight: () => 1,
  showLegend: false,
  legendPosition: 'top-left',
}


const HexLayerMap = ({
  fillBasedOnInit,
  fillColors,
  elevationBasedOnInit,
  elevations,
  onClick,
  onHover,
  opacity,
  getElevationWeight,
  getColorWeight,
  showLegend,
  legendPosition,
  mapboxApiAccessToken,
  ...hexLayerProps
}) => {
  const { data, metrics, metricDispatch } = useMapData({})

  // NOTE: HexagonLayer processes its own values based on range of elevation and fill
  const [elevationBasedOn, setElevationBasedOn] = useState(elevationBasedOnInit)
  useEffect(() => {
    setElevationBasedOn(elevationBasedOnInit)
  }, [elevationBasedOnInit])

  const [fillBasedOn, setFillBasedOn] = useState(fillBasedOnInit)
  useEffect(() => {
    setFillBasedOn(fillBasedOnInit)
  }, [fillBasedOnInit])

  const handleSetData = d => {
    let payload = []
    try {
      payload = JSON.parse(d)
    } catch (_) {
      console.warn('Not Valid JSON, attempt to parse as CSV')
    }
    try {
      payload = convertCSVtoJSON(d)
    } catch (_) {
      console.warn('Not Valid CSV')
    }
    // basic validation
    if (Array.isArray(payload)) {
      metricDispatch({ type: 'data', payload })
    }
  }

  const finalGetColorWeight = useMemo(() => {
    if (fillBasedOn.length) {
      return d => d[fillBasedOn] || 1
    }
    return getColorWeight
  }, [fillBasedOn, getColorWeight])

  const finalGetElevationWeight = useMemo(() => {
    if (elevationBasedOn.length) {
      return d => d[elevationBasedOn] || 1
    }
    return getElevationWeight
  }, [elevationBasedOn, getElevationWeight])

  const layers = useMemo(() => ([
    new HexagonLayer({
      id: 'xyz-hex-layer',
      data,
      getPosition: d => [d.lon, d.lat],
      pickable: onClick || onHover,
      onClick,
      onHover,
      opacity,
      extruded: elevationBasedOn.length,
      radius: 1000, // max size of each hex
      upperPercentile: 100, // top end of data range
      coverage: 1, // how much of the radius each hex fills
      // NOTE: values are calculated automatically, using ranges below
      colorRange: fillColors.map(o => {
        const c = color(o)
        return [c.r, c.g, c.b]
      }),
      elevationRange: elevations,
      getColorWeight: finalGetColorWeight,
      getElevationWeight: finalGetElevationWeight,
      updateTriggers: {
        getColorWeight: [fillColors, finalGetColorWeight, metrics],
        getElevationWeight: [elevations, finalGetElevationWeight, metrics],
      },
      ...hexLayerProps,
    }),
  ]), [
    hexLayerProps,
    data,
    onClick,
    onHover,
    elevationBasedOn.length,
    finalGetElevationWeight,
    finalGetColorWeight,
    elevations,
    fillColors,
    opacity,
    metrics,
  ])

  const legends = useLegends({ elevationBasedOn, fillBasedOn, fillColors, metrics })

  return (
    <div>
      <div>
        <div style={{ padding: '1rem', border: '1px dashed black' }}>
          <Loader setData={handleSetData} accept='text/plain, .csv, application/json' />
        </div>
        <div>
          <strong>Fill Based On</strong>
          <select value={fillBasedOn} onChange={e => setFillBasedOn(e.target.value)}>
            <option value=''>None</option>
            {Object.keys(metrics).map(key => <option key={key}>{key}</option>)}
          </select>
        </div>
        <div>
          <strong>Elevation Based On</strong>
          <select value={elevationBasedOn} onChange={e => setElevationBasedOn(e.target.value)}>
            <option value=''>None</option>
            {Object.keys(metrics).map(key => <option key={key}>{key}</option>)}
          </select>
        </div>
      </div>
      <Map
        layers={layers}
        showLegend={showLegend}
        position={legendPosition}
        legends={legends}
        mapboxApiAccessToken={mapboxApiAccessToken}
      />
    </div>
  )
}

HexLayerMap.propTypes = { ...propTypes, ...commonProps }
HexLayerMap.defaultProps = { ...defaultProps, ...commonDefaultProps }

export default HexLayerMap
