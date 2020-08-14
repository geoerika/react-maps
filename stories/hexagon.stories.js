/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import HexagonMap from '../src/components/hexagon-map'


storiesOf('Hexagon Map', module)
  .add('Basic rendering', () => (
    <HexagonMap showLegend />
  ))
  // .add('Dynamic Fill', () => (
  //   <GeoJsonMap defaultFillBasedOn='unique_visitors_mean' showLegend/>
  // ))
  // .add('Dynamic Elevation', () => (
  //   <GeoJsonMap extruded defaultElevationBasedOn='unique_visitors_median' showLegend />
  // ))
  // .add('Dynamic Fill & Elevation', () => (
  //   <GeoJsonMap showLegend defaultFillBasedOn='unique_visitors_mean' extruded defaultElevationBasedOn='unique_visitors_median' />
  // ))