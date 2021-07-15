import React from 'react'

import axios from 'axios'

import { LoginContextProvider } from '@eqworks/common-login'
import { ReportMap } from '../src'
import { AuthMapWrapper } from '../src'
import FO from './locus/actions'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

const jwt = window.localStorage.getItem('auth_jwt')

const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': jwt },
})

const getReport = FO(api).getReportWi

export default {
  title: 'Walk-In Report',
  component: ReportMap,
}

const mapArgs = {
  getReport,
  report_id: 4,
  layer_id: 1,
  map_id: 145,
  mapboxApiAccessToken,
}

const Template = (args) =>
  <LoginContextProvider>
    <AuthMapWrapper>
      <ReportMap {...args} />
    </AuthMapWrapper>
  </LoginContextProvider>


export const BasicReport = Template.bind({})
BasicReport.args = mapArgs

export const ReportWithTooltip = Template.bind({})
ReportWithTooltip.args = {
  fillBasedOn: 'visits',
  legendPosition: 'bottom-right',
  showLegend: true,
  useTooltip: true,
  ...mapArgs,
}

// NOTE: large values skew this
export const RadiusBasedOnVisits = Template.bind({})
RadiusBasedOnVisits.args = { radiusBasedOn: 'visits', ...mapArgs }

export const RadiusBasedOnSaturday = Template.bind({})
RadiusBasedOnSaturday.args = { radiusBasedOn: 'Sat', ...mapArgs }

export const RadiusBasedOnNoon = Template.bind({})
RadiusBasedOnNoon.args = { radiusBasedOn: '12', ...mapArgs }

// NOTE: large values skew this
export const FillBasedOnVisits = Template.bind({})
FillBasedOnVisits.args = { fillBasedOn: 'visits', ...mapArgs }

export const DefaultLegend = Template.bind({})
DefaultLegend.args = { fillBasedOn: 'visits', showLegend: true, ...mapArgs }

export const BottomRightLegend = Template.bind({})
BottomRightLegend.args = { legendPosition: 'bottom-right', ...DefaultLegend.args }

export const MultipleLegends = Template.bind({})
MultipleLegends.args = { ...BottomRightLegend.args, radiusBasedOn: 'visits' }
