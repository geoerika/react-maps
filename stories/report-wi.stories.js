/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import axios from 'axios'

import FO from '../src/actions'
import ReportMap from '../src/components/report-wi-map'


const getAxios = () => axios.create({
  baseURL: process.env.API_URL,
  headers: { 'eq-api-jwt': process.env.FO_TOKEN },
})

const getReport = FO(getAxios()).getReportWi

storiesOf('Walk-In Report', module)
  .add('Basic Report', () => (
    <ReportMap getReport={getReport} report_id={4} layer_id={1} map_id={145} />
  ))
