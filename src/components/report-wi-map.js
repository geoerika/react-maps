import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Map from './generic-map'
import Scatter from './layers/scatter-plot'


const propTypes = {
  getReport: PropTypes.func.isRequired,
  report_id: PropTypes.number.isRequired,
  layer_id: PropTypes.number.isRequired,
  map_id: PropTypes.number.isRequired,
}
const defaultProps = { layers: [] }

// DeckGL react component
const ReportWIMap = ({ getReport, report_id, layer_id, map_id }) => {
  const [layers, setLayers] = useState([])
  useEffect(() => {
    const getData = async () => {
      // TODO properly set layers!
      const reportData = await getReport({ report_id, layer_id, map_id })
      console.log('---> data!', reportData)
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
      setLayers([
        Scatter({
          id: 'scatterplot-layer',
          data: reportData,
          getPosition: d => [d.lon, d.lat],
          pickable: true,
          onClick: d => console.log('---> click', d),
          onHover: d => console.log('---> hover', d),
          autoHighlight: true,
          opacity: 0.8,
          getRadius: d => { console.log('radius', d); return d.visits },
          radiusScale: 5,
          radiusMinPixels: 10,
          radiusMaxPixels: 100,
          filled: true,
          getFillColor: d => [255, 140, 0],
          stroked: true,
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 10,
          getLineWidth: d => d.visits,
          getLineColor: d => [0, 0, 0],
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
