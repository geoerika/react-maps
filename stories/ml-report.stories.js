/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import { MLReportMap } from '../src'
import { getCursor } from '../src/utils'
import vwiJson from './data/locus-ml-vwi.json'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

storiesOf('Locus ML Report', module)
  .add('VWI - basic', () => (
    <MLReportMap
      reportData={vwiJson}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - default cursor on hover and default zoom on click', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - disable default onClick and cursor', () => (
    <MLReportMap
      reportData={vwiJson}
      onClick={() => {}}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - data-based radius', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      radiusBasedOn={'converted_visits'}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - data-based colour fill and radius', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      radiusBasedOn={'converted_visits'}
      fillBasedOn={'converted_unique_visitors'}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - tooltip', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      showTooltip={true}
      radiusBasedOn={'converted_visits'}
      fillBasedOn={'converted_unique_visitors'}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - zoom to point', () => {
    const [centerMap, setCenterMap] = useState()
    const [highlightId, setHighlightId] = useState()
    const zoom = () => {
      setCenterMap({ longitude: vwiJson[0].lon, latitude: vwiJson[0].lat, zoom: 15 })
      setHighlightId(vwiJson[0].poi_id)
    }
    return (
      <div>
        <button onClick={zoom}>Zoom</button>
        <MLReportMap
          reportData={vwiJson}
          centerMap={centerMap}
          highlightId={highlightId}
          getTooltip={o => o.object?.name}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
      </div>
    )
  })
