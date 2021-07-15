import React from 'react'

import { GeoCohortMap } from '../src'
import { getCursor } from '../src/utils'
import geoCohortFSAraw from './data/geo-cohort-FSA.json'
import geoCohortPostalraw from './data/geo-cohort-postal.json'
import geoCohortJsonZero from './data/geo-cohorts-zero.json'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

const truncate = (fullStr, strLen, separator = ' ... ') => {
  if (fullStr.length <= strLen) {
    return fullStr
  }
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return fullStr.substr(0, frontChars)
           + separator
           + fullStr.substr(fullStr.length - backChars)
}

const formatData = {
  Revenue: d => '$' + d,
}

const reportFSAData = geoCohortFSAraw.filter(elem => elem?.type === 'Feature')
const reportGeoCohortData = geoCohortPostalraw.filter(elem => elem?.type === 'Feature')


export default {
  title: 'GeoCohort Map',
  component: GeoCohortMap,
}

const mapArgs = {
  reportFSAData,
  reportGeoCohortData,
  getCursor: getCursor(),
  mapboxApiAccessToken,
}

const Template = (args) => <GeoCohortMap {...args} />


export const Basic = Template.bind({})
Basic.args = mapArgs

export const ColourFill = Template.bind({})
ColourFill.args = { fillBasedOn: 'Imps', ...mapArgs }

export const Elevation = Template.bind({})
Elevation.args = { elevationBasedOn: 'Revenue', pitch: 45, ...mapArgs }

export const Tooltip = Template.bind({})
Tooltip.args = { fillBasedOn: 'Imps', showTooltip: true, ...mapArgs }

export const TooltipWithCustomTootltipKeys = Template.bind({})
TooltipWithCustomTootltipKeys.args = {
  fillBasedOn: 'Imps',
  showTooltip: true,
  tooltipKeys: {
    metricKeys: ['Imps', 'Clicks', 'Bids', 'Revenue'],
    metricAliases: {
      Imps: 'Impressions',
      Revenue: 'Spend',
    },
  },
  ...mapArgs,
}

export const LegendColorFill = Template.bind({})
LegendColorFill.args = { fillBasedOn: 'Imps', showTooltip: true, showLegend: true, ...mapArgs }

export const LegendElevation = Template.bind({})
LegendElevation.args = { elevationBasedOn: 'Revenue', pitch: 45, showLegend: true, ...mapArgs }

export const FullFeature = Template.bind({})
FullFeature.args = { ...TooltipWithCustomTootltipKeys.args, ...LegendElevation.args }

export const FormatLegendTitle = Template.bind({})
FormatLegendTitle.args = {
  ...TooltipWithCustomTootltipKeys.args,
  showLegend: true,
  formatLegendTitle: (label) => truncate(label, 10),
  ...mapArgs,
}

export const FormatDataValues = Template.bind({})
FormatDataValues.args = {
  ...TooltipWithCustomTootltipKeys.args,
  showLegend: true,
  formatData: formatData,
  ...mapArgs,
}

export const CustomOpacity = Template.bind({})
CustomOpacity.args = { opacity: 0.8, ...LegendColorFill.args }

export const ZeroValues = Template.bind({})
ZeroValues.args = {
  ...mapArgs,
  reportFSAData: geoCohortJsonZero,
  reportGeoCohortData: geoCohortJsonZero,
  fillBasedOn: 'Bids',
  elevationBasedOn: 'Clicks',
  pitch: 45,
  showTooltip: true,
  showLegend: true,
  tooltipKeys: {
    metricKeys: ['Clicks', 'Bids'],
    metricAliases: {
      Imps: 'Impressions',
      Revenue: 'Spend',
    },
  },
}
