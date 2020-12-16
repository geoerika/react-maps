import React, { useState, useEffect, useReducer, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'
import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { color } from 'd3-color'

import { useLegends, useFullReport, useTimeline } from '../hooks'
import { hours, days } from '../constants'
import { reportWI } from '../datasets'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import EntryList from './entry-list'
import TimelineControls from './controls'
import MetricSelector from './controls/report-wi-metrics'
import PeriodSelector from './controls/report-periods'


setup(React.createElement)

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

const Container = styled('div')`
  padding: 5px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const MapContainer = styled('div')`
  flex-grow: 10;
  padding: 5px;
`

// DeckGL react component
const ReportWIMap = ({
  getReport,
  report_id,
  layer_id,
  map_id,
  radiusBasedOn: radiusBasedOnInit,
  radiusDataScale,
  radii,
  fillBasedOn: fillBasedOnInit,
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
  const [tooltip, tooltipDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'show') {
      const { x, y, object, lngLat } = payload
      return {
        ...state,
        // toggle clicked object
        show: !state.show || (state.object || {}).poi_id !== object.poi_id,
        x,
        y,
        lngLat,
        object,
      }
    }
    return {
      ...state,
      [type]: payload,
    }
  }, { show: false, translate: true })

  const finalOnClick = useCallback(o => {
    if (onClick) {
      onClick(o)
    }
    if (useTooltip) {
      tooltipDispatch({ type: 'show', payload: o })
    }
  }, [onClick, useTooltip])


  const { timelineDispatch, ...timeline } = useTimeline([], 500)
  const [timelineType, setTimelineType] = useState('period')
  const handleTimelineTypeChange = e => setTimelineType(e.target.value)
  // TODO reducer for below
  // TODO init should be accounted for
  const [radiusBasedOn, setRadiusBasedOn] = useState(radiusBasedOnInit)
  const [radiusBasedOnType, setRadiusBasedOnType] = useState('')
  const [fillBasedOn, setFillBasedOn] = useState(fillBasedOnInit)
  const [fillBasedOnType, setFillBasedOnType] = useState('')
  const report = useFullReport({ getReport, report_id, layer_id, map_id })

  
  const [{ period, periods }, periodDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'api') {
      return {
        ...state,
        period: payload.duration,
        periods: payload.durations.filter(({ date_type }) => date_type == payload.duration.date_type),
        durations: payload.durations,
      }
    }
    if (type === 'periodType') {
      if (payload !== state.period.date_type) {
        const periods = state.durations.filter(({ date_type }) => date_type == payload)
        return {
          ...state,
          period: periods[0],
          periods,
        }
      }
      return state
    }
    return {
      ...state,
      [type]: payload,
    }
  }, { period: {}, periods: [], durations: [], periodType: 1 })

  useEffect(() => {
    periodDispatch({ type: 'api', payload: report })
  }, [report])

  // 2 way sync with timeline
  // TODO could add logic to TURN OFF other basedOn when changes are made
  // e.g. manually set radiusBasedOn, then when you change timelineType
  // to fillBasedOn, radiusBasedOn is set to ''
  useEffect(() => {
    if (timelineType === 'period') {
      timelineDispatch({ type: 'timestamps', payload: periods })
    } else if (['hod-r', 'hod-f'].includes(timelineType)) {
      if (timelineType.split('-')[1] === 'r') {
        setRadiusBasedOnType('hod')
      } else {
        setFillBasedOnType('hod')
      }
      timelineDispatch({ type: 'timestamps', payload: hours })
    }  else if (['dow-r', 'dow-f'].includes(timelineType)) {
      if (timelineType.split('-')[1] === 'r') {
        setRadiusBasedOnType('dow')
      } else {
        setFillBasedOnType('dow')
      }
      timelineDispatch({ type: 'timestamps', payload: days })
    }
  }, [periods, timelineDispatch, timelineType])

  // TODO: the state should be a direct result of activeIndex
  // timelineType should never change while the player is active?
  useEffect(() => {
    if (timelineType === 'period') {
      periodDispatch({ type: 'period', payload: periods[timeline.activeIndex] || {} })
    } else if (timelineType === 'hod-f') {
      setFillBasedOn(hours[timeline.activeIndex])
    } else if (timelineType === 'hod-r') {
      setRadiusBasedOn(hours[timeline.activeIndex])
    } else if (timelineType === 'dow-f') {
      setFillBasedOn(days[timeline.activeIndex])
    } else if (timelineType === 'dow-r') {
      setRadiusBasedOn(days[timeline.activeIndex])
    }
  }, [timeline.activeIndex, periods, timelineType])

  useEffect(() => {
    timelineDispatch({ type: 'timestamps', payload: periods })
  }, [timelineDispatch, periods])

  const { data, metrics } = (report[period.key] || { data: [], metrics: {} })

  const layers = useMemo(() => {
    let finalGetRadius = getRadius
    if (radiusBasedOn.length) {
      const d3Fn = SCALES[radiusDataScale]([
        (metrics[radiusBasedOn] || { min: 0 }).min,
        (metrics[radiusBasedOn] || { max: 10 }).max,
      ], radii)

      finalGetRadius = d => d3Fn(d[radiusBasedOn])
    } 
    
    let finalGetFillColor = getFillColor
    if (fillBasedOn.length) {
      const d3Fn = SCALES[fillDataScale]([
        (metrics[fillBasedOn] || { min: 0 }).min,
        (metrics[fillBasedOn] || { max: 10 }).max,
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
        pickable: useTooltip || onClick || onHover,
        onClick: finalOnClick,
        onHover,
        opacity,
        getRadius: finalGetRadius,
        getFillColor: finalGetFillColor,
        updateTriggers: {
          getRadius: [finalGetRadius, radiusBasedOn, getRadius],
          getFillColor: [finalGetFillColor, fillBasedOn, getFillColor],
        },
        getLineWidth,
        getLineColor,
        ...scatterLayerProps,
      }),
    ]
  }, [
    report_id,
    scatterLayerProps,
    data,
    metrics,
    useTooltip,
    finalOnClick,
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

  const legends = useLegends({ radiusBasedOn, fillBasedOn, fillColors, metrics })
  
  const handleRadiusBasedOnChange = e => setRadiusBasedOn(e.target.value)
  const handleRadiusTypeChange = e => {
    const update = e.target.value
    let basedOn = ''
    if (update === 'metric') {
      basedOn = reportWI.DATA_FIELDS[0]
    } else if (update === 'dow') {
      basedOn = days[0]
    } else if (update === 'hod') {
      basedOn = hours[0]
    }
    setRadiusBasedOn(basedOn)
    setRadiusBasedOnType(update)
  }

  const handleFillBasedOnChange = e => setFillBasedOn(e.target.value)
  const handleFillTypeChange = e => {
    const update = e.target.value
    let basedOn = ''
    if (update === 'metric') {
      basedOn = reportWI.DATA_FIELDS[0]
    } else if (update === 'dow') {
      basedOn = days[0]
    } else if (update === 'hod') {
      basedOn = hours[0]
    }
    setFillBasedOn(basedOn)
    setFillBasedOnType(update)
  }
  return (
    <Container>
      <div>
        <label>Radius Based On:</label>
        <MetricSelector selected={radiusBasedOn} callback={handleRadiusBasedOnChange} type={radiusBasedOnType} typeCallback={handleRadiusTypeChange}/>
        <label>Fill Based On:</label>
        <MetricSelector selected={fillBasedOn} callback={handleFillBasedOnChange} type={fillBasedOnType} typeCallback={handleFillTypeChange}/>
        <div>
          <label>Timeline Type</label><br />
          <select onChange={handleTimelineTypeChange} disabled={timeline.player}>
            <option value='period'>Report Period (uses current metric)</option>
            <option value='hod-r'>Hour of Day (Radius)</option>
            <option value='hod-f'>Hour of Day (Fill)</option>
            <option value='dow-r'>Day of Week (Radius)</option>
            <option value='dow-f'>Day of Week (Fill)</option>
          </select>
        </div>
        <PeriodSelector
          selected={period}
          selectPeriodType={payload => periodDispatch({ type: 'periodType', payload })}
          selectPeriod={payload => periodDispatch({ type: 'period', payload })}
          periods={periods}
        />
      </div>
      {(timeline.timestamps && timeline.timestamps.length > 0) && <TimelineControls {...timeline} />}
      <MapContainer>
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
      </MapContainer>
    </Container>
  )
}

ReportWIMap.propTypes = propTypes
ReportWIMap.defaultProps = defaultProps

export default ReportWIMap
