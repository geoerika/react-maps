/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import axios from 'axios'

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
    <GeoJsonMap fillBasedOn='unique_visitors_mean' showLegend/>
  ))
  .add('Dynamic Elevation', () => (
    <GeoJsonMap extruded elevationBasedOn='unique_visitors_median' />
  ))
  .add('Dynamic Fill & Elevation', () => (
    <GeoJsonMap onClick={o => console.log('==== CLICK', o)} fillBasedOn='unique_visitors_mean' extruded elevationBasedOn='unique_visitors_median' />
  ))


