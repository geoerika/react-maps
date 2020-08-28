/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { GeoJSONMap } from '../src'


storiesOf('GeoJSON Map', module)
  .add('Basic rendering', () => (
    <GeoJSONMap />
  ))
  .add('Dynamic Fill', () => (
    <GeoJSONMap defaultFillBasedOn='unique_visitors_mean' showLegend/>
  ))
  .add('Dynamic Elevation', () => (
    <GeoJSONMap defaultElevationBasedOn='unique_visitors_median' showLegend />
  ))
  .add('Dynamic Fill & Elevation', () => (
    <GeoJSONMap showLegend defaultFillBasedOn='unique_visitors_mean' defaultElevationBasedOn='unique_visitors_median' />
  ))
