import React from 'react'

import { LocusMap } from '../src'
import { getCursor } from '../src/utils'

import xwiData from './data/xwi-report.json'
import poiRadiiTo from './data/pois-radii-to.json'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN

export default {
  title: 'Locus Map',
  component: LocusMap,
}

const dataConfig = [
  { id: 'xwiReport-123', data: xwiData },
  { id: 'poiGeojson-123', data: poiRadiiTo },
]

const layerConfig = [
  {
    layer: 'geojson',
    dataId: 'poiGeojson-123',
    visualizations: {
      radius: {
        value: { field: 'radius' },
        valueOptions: [100, 500],
        dataScale: 'linear',
      },
      fill: {
        value: { field: 'radius' },
        valueOptions: [[186, 224, 255], [0, 117, 255]],
        dataScale: 'linear',
      },
    },
    interactions: {},
  },
  {
    layer: 'arc',
    dataId: 'xwiReport-123',
    geometry: {
      source: { longitude: 'source_lon', latitude: 'source_lat' },
      target: { longitude: 'target_lon', latitude: 'target_lat' },
    },  
    visualizations: {
      sourceArcColor: [246, 91, 32], 
      targetArcColor: [153, 40, 179],
    },
    interactions: {},
  },
  {
    layer: 'scatterplot',
    dataId: 'xwiReport-123',
    geometry: { longitude: 'source_lon', latitude: 'source_lat' },
    visualizations: {
      radius: { value: 5 },
      fill: {
        value: [153, 40, 179],
        dataScale: 'linear',
      },
    },
    interactions: {},
  },
  {
    layer: 'scatterplot',
    dataId: 'xwiReport-123',
    geometry: { longitude: 'target_lon', latitude: 'target_lat' },
    visualizations: {
      radius: { value: 5 },
      fill: {
        value: [246, 91, 32],
        dataScale: 'linear',
      },
    },
    interactions: {},
  },
]

const mapArgs = {
  layerConfig,
  dataConfig,
  getCursor: getCursor(),
  mapboxApiAccessToken,
}

const Template = (args) => <LocusMap {...args} />

export const Basic = Template.bind({})
Basic.args = mapArgs
