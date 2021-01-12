/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { GeoJSONMap } from '../src'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

storiesOf('GeoJSON Map', module)
  .add('Basic rendering', () => (
    <GeoJSONMap mapboxApiAccessToken={ mapboxApiAccessToken }/>
  ))
  .add('Dynamic Fill', () => (
    <GeoJSONMap
      defaultFillBasedOn='unique_visitors_mean'
      showLegend
      mapboxApiAccessToken={ mapboxApiAccessToken }
    />
  ))
  .add('Dynamic Elevation', () => (
    <GeoJSONMap
      defaultElevationBasedOn='unique_visitors_median'
      showLegend
      mapboxApiAccessToken={ mapboxApiAccessToken }
    />
  ))
  .add('Dynamic Fill & Elevation', () => (
    <GeoJSONMap
      showLegend defaultFillBasedOn='unique_visitors_mean'
      defaultElevationBasedOn='unique_visitors_median'
      mapboxApiAccessToken={ mapboxApiAccessToken }
    />
  ))
