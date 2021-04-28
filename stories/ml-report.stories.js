/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { MLReportMap } from '../src'
import { getCursor } from '../src/utils'
import vwiJson from './data/locus-ml-vwi.json'
import vwiJsonZero from './data/locus-ql-zero.json'


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
  .add('VWI - data-based colour fill', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
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
  .add('VWI - show legend for data-based radius', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      showTooltip={true}
      radiusBasedOn={'converted_unique_visitors_single_visit'}
      showLegend={true}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - show legend for data-based colour tones', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      showTooltip={true}
      fillBasedOn={'converted_unique_visitors'}
      showLegend={true}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - custom opacity', () => (
    <MLReportMap
      reportData={vwiJson}
      getCursor={getCursor()}
      showTooltip={true}
      radiusBasedOn={'converted_visits'}
      showLegend={true}
      opacity={.1}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - zero min and max values for radius and radiusFill legend', () => (
    <MLReportMap
      reportData={vwiJsonZero}
      getCursor={getCursor()}
      showTooltip={true}
      radiusBasedOn={'visits'}
      fillBasedOn={'converted_unique_visitors_single_visit'}
      showLegend={true}
      opacity={.5}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
