/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { QLReportMap } from '../src'
import { truncate } from '../src/utils/string-functions'
import vwiJson from './data/locus-ml-vwi.json'
import vwiJsonZero from './data/locus-ql-zero.json'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN

const formatDataKey = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')


storiesOf('Locus QL Report', module)
  .add('VWI - basic with default zoom on click', () => (
    <QLReportMap
      reportData={vwiJson}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - disable default onClick and cursor', () => (
    <QLReportMap
      reportData={vwiJson}
      onClick={() => {}}
      getCursor={() => {}}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - data-based radius', () => (
    <QLReportMap
      reportData={vwiJson}
      radiusBasedOn={'converted_visits'}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - data-based colour fill', () => (
    <QLReportMap
      reportData={vwiJson}
      fillBasedOn={'converted_unique_visitors'}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - tooltip', () => (
    <QLReportMap
      reportData={vwiJson}
      showTooltip={true}
      radiusBasedOn={'converted_visits'}
      fillBasedOn={'converted_unique_visitors'}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - show legend for data-based radius', () => (
    <QLReportMap
      reportData={vwiJson}
      showTooltip={true}
      radiusBasedOn={'converted_unique_visitors_single_visit'}
      showLegend={true}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - show legend for data-based colour tones', () => (
    <QLReportMap
      reportData={vwiJson}
      showTooltip={true}
      fillBasedOn={'converted_unique_visitors'}
      showLegend={true}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - custom opacity', () => (
    <QLReportMap
      reportData={vwiJson}
      showTooltip={true}
      radiusBasedOn={'converted_visits'}
      showLegend={true}
      opacity={.1}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - zero min and max values for radius and radiusFill legend', () => (
    <QLReportMap
      reportData={vwiJsonZero}
      showTooltip={true}
      radiusBasedOn={'visits'}
      fillBasedOn={'converted_unique_visitors_single_visit'}
      showLegend={true}
      opacity={.5}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - format property key in Legend title and Tooltip keys', () => (
    <QLReportMap
      reportData={vwiJson}
      showTooltip={true}
      radiusBasedOn={'visits'}
      fillBasedOn={'converted_unique_visitors_single_visit'}
      formatDataKey={formatDataKey}
      showLegend={true}
      opacity={.5}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('VWI - format tootltip title value', () => (
    <QLReportMap
      reportData={vwiJson}
      showTooltip={true}
      radiusBasedOn={'visits'}
      formatDataKey={formatDataKey}
      formatTooltipTitleValue={(value) => truncate(value, 20)}
      showLegend={true}
      opacity={.5}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
