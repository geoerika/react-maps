/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
// import axios from 'axios'

// import FO from '../src/actions'
import GeoJsonMap from '../src/components/geojson-map'


// const getAxios = () => axios.create({
//   baseURL: process.env.API_URL,
//   headers: { 'eq-api-jwt': process.env.FO_TOKEN },
// })

// const getReport = FO(getAxios()).getReportWi

storiesOf('GeoJSON Map', module)
  .add('Basic rendering', () => (
    <GeoJsonMap />
  ))
  .add('Dynamic Fill', () => (
    <GeoJsonMap defaultFillBasedOn='unique_visitors_mean' showLegend/>
  ))
  .add('Dynamic Elevation', () => (
    <GeoJsonMap extruded defaultElevationBasedOn='unique_visitors_median' showLegend />
  ))
  .add('Dynamic Fill & Elevation', () => (
    <GeoJsonMap showLegend defaultFillBasedOn='unique_visitors_mean' extruded defaultElevationBasedOn='unique_visitors_median' />
  ))


