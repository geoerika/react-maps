/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import GeoJsonMap from '../src/components/geojson-map'


storiesOf('GeoJSON Map', module)
  .add('Basic rendering', () => (
    <GeoJsonMap />
  ))
  .add('Dynamic Fill', () => (
    <GeoJsonMap defaultFillBasedOn='unique_visitors_mean' showLegend/>
  ))
  .add('Dynamic Elevation', () => (
    <GeoJsonMap defaultElevationBasedOn='unique_visitors_median' showLegend />
  ))
  .add('Dynamic Fill & Elevation', () => (
    <GeoJsonMap showLegend defaultFillBasedOn='unique_visitors_mean' defaultElevationBasedOn='unique_visitors_median' />
  ))
