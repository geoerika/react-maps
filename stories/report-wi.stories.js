/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import ReportMap from '../src/components/report-wi-map'

import axios from 'axios'

import FO from './actions'

const getAxios = () => axios.create({
  baseURL: process.env.API_URL,
  headers: { 'eq-api-jwt': process.env.FO_TOKEN },
})

const getReport = FO(getAxios()).getReportWi

storiesOf('Walk-In Report', module)
  .add('Basic Report', () => (
    <ReportMap getReport={getReport} />
  ))
