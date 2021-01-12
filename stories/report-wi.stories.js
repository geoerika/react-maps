/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import axios from 'axios'

import FO from '../src/actions'
import { ReportMap } from '../src'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

const getAxios = () => axios.create({
  baseURL: process.env.API_URL,
  headers: { 'eq-api-jwt': process.env.FO_TOKEN },
})

const getReport = FO(getAxios()).getReportWi

storiesOf('Walk-In Report', module)
  .add('Basic Report', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Report with Tooltip', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      fillBasedOn='visits'
      legendPosition='bottom-right'
      showLegend
      useTooltip
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Radius Based On Visits', () => (
    // NOTE: large values skew this
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      radiusBasedOn='visits'
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Radius Based On Saturday', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      radiusBasedOn='Sat'
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Radius Based On Noon', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      radiusBasedOn='12'
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Fill Based On Visits', () => (
    // NOTE: large values skew this
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      fillBasedOn='visits'
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Default Legend', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      fillBasedOn='visits'
      showLegend
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Bottom Right Legend', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      fillBasedOn='visits'
      showLegend
      legendPosition='bottom-right'
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
  .add('Multiple Legends', () => (
    <ReportMap
      getReport={getReport}
      report_id={4}
      layer_id={1}
      map_id={145}
      fillBasedOn='visits'
      radiusBasedOn='visits'
      showLegend
      legendPosition='bottom-right'
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  ))
