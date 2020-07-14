import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'
import { intensityByMetric } from '../utils'


const propTypes = {
  getReport: PropTypes.func.isRequired,
  report_id: PropTypes.number.isRequired,
  layer_id: PropTypes.number.isRequired,
  map_id: PropTypes.number.isRequired,
  radiusBasedOn: PropTypes.string,
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
  radiusBasedOn: '',
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
}

// DeckGL react component
const ReportWIMap = ({
  getReport,
  report_id,
  layer_id,
  map_id,
  radiusBasedOn,
  onClick,
  onHover,
  opacity,
  getRadius,
  getFillColor,
  getLineWidth,
  getLineColor,
  ...scatterLayerProps
}) => {
  const [layers, setLayers] = useState([])
  useEffect(() => {
    const getData = async () => {
      // TODO properly set layers!
      const reportData = await getReport({ report_id, layer_id, map_id })
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
      setLayers([
        Scatter({
          id: `${report_id}-report-scatterplot-layer`,
          data: reportData,
          getPosition: d => [d.lon, d.lat],
          pickable: onClick || onHover,
          onClick,
          onHover,
          opacity,
          getRadius: finalGetRadius,
          getFillColor,
          getLineWidth,
          getLineColor,
          ...scatterLayerProps,
        })
      ])
    }
    getData()
  }, [report_id, layer_id, map_id])

  return (
    <Map layers={layers} />
  )
}

ReportWIMap.propTypes = propTypes
ReportWIMap.defaultProps = defaultProps

export default ReportWIMap
