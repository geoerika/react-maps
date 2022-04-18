import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ButtonGroup, Button } from '@eqworks/lumen-labs'
import { Icons } from '@eqworks/lumen-labs'

import { LocusMap } from '../src'
import { getCursor } from '../src/utils'

import poiRadiiTo from './data/pois-radii-to.json'
import regionGeoJSON from './data/locus-region-geojson.json'
import wiReportData from './data/wi-report.json'
import xwiReportData from './data/xwi-report.json'
import mvtData from './data/locus-map-mvt.json'
import fsaGeojsonData from './data/locus-map-fsa.json'


const SelectButtonGroup = ({ setSelectShape }) => {
  return (
    <ButtonGroup variant='outlined' size='md'>
      <Button
        id='select-circle'
        onClick={ () => setSelectShape('circle') }
      >
        <Icons.AddCircle size='md' />
      </Button>
      <Button
        id='select-rectangle'
        onClick={ () => setSelectShape('rectangle') }
      >
        <Icons.AddSquare size='md' />
      </Button>
      <Button
        id='select-polygon'
        onClick={ () => setSelectShape('polygon') }
      >
        <Icons.Add size='md' />
      </Button>
    </ButtonGroup>
  )
}

SelectButtonGroup.propTypes = {
  setSelectShape: PropTypes.func.isRequired,
}

const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN

export default {
  title: 'Locus Map',
  component: LocusMap,
  parameters: {
    layout: 'fullscreen',
  },
}

const mapConfig = {
  showMapLegend: true,
  showMapTooltip: true,
  cursor: (layers) => getCursor({ layers }),
  legendPosition: 'top-right',
  legendSize: 'lg',
  mapboxApiAccessToken,
}

const dataConfig = [
  { id: 'xwiReport-123', data: xwiReportData },
  { id: 'wiReportData-123', data: wiReportData },
  { id: 'poiGeojson-123', data: poiRadiiTo },
  { id: 'regionGeojson-123', data: regionGeoJSON },
  {
    id: 'mvt-123',
    data: {
      tileGeom: 'https://mapsource.locus.place/maps/ct/{z}/{x}/{y}.vector.pbf?',
      tileData: mvtData,
    },
  },
  {
    id: 'fsa-geojson-123',
    data: {
      tileGeom: 'https://mapsource.locus.place/maps/fsa/{z}/{x}/{y}.vector.pbf?',
      tileData: fsaGeojsonData,
    },
  },
  { id: 'select-123', data: [] },
]

const GeoJSONLayerConfig = {
  layer: 'geojson',
  dataId: 'poiGeojson-123',
  visualizations: {
    radius: {
      value: { field: 'radius' },
    },
    fill: {
      value: [102, 108, 198],
    },
  },
  opacity: 0.3,
  interactions: {
    tooltip: {
      tooltipKeys: {
        name: 'name',
        id: 'id',
        metricKeys: ['lon', 'lat'],
        nameAccessor: d => d.properties,
        idAccessor: d => d.properties,
      },
    },
  },
  legend: { showLegend: true },
}

const textGeoJSONLayerConfig = {
  layer: 'text',
  dataId: 'poiGeojson-123',
  dataPropertyAccessor: d => d.properties,
  visualizations: {
    text: {
      value: {
        title: 'id',
        valueKeys: ['radius'],
      },
    },
    pixelOffset: { value: [0, 0] },
  },
}

const polygonGeoJSONLayerConfig = {
  layer: 'geojson',
  dataId: 'regionGeojson-123',
  visualizations: {
    fill: {
      value: {
        field: 'Visits (sum)',
      },
    },
  },
  opacity: 0.3,
  interactions: {
    tooltip: {
      tooltipKeys: {
        id: 'Address region',
        metricKeys: ['Visits (sum)'],
        nameAccessor: d => d.properties,
        idAccessor: d => d.properties,
      },
    },
  },
  legend: { showLegend: true },
}

const polygonTextGeoJSONLayerConfig = {
  layer: 'text',
  dataId: 'regionGeojson-123',
  dataPropertyAccessor: d => d.properties,
  geometry: {
    longitude: 'longitude',
    latitude: 'latitude',
    geometryAccessor: d => d.properties,
  },
  visualizations: {
    text: {
      value: {
        title: 'Address region',
        valueKeys: ['Visits (sum)'],
      },
    },
    size: { value: 14 },
    pixelOffset: { value: [-30, 0] },
    anchor: { value: 'start' },
  },
}

const arcLayerConfig = {
  layer: 'arc',
  dataId: 'xwiReport-123',
  geometry: {
    source: { longitude: 'source_lon', latitude: 'source_lat' },
    target: { longitude: 'target_lon', latitude: 'target_lat' },
  },
  visualizations: {
    sourceArcColor: { value: [182, 38, 40] },
    targetArcColor: { value: [251, 201, 78] },
    arcWidth: { value: 2 },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        metricKeys: ['source_poi_id', 'target_poi_id', 'xvisit_visits', 'xvisit_unique_visitors'],
      },
    },
  },
}

const ScatterPlotLayer1Config = {
  layer: 'scatterplot',
  dataId: 'xwiReport-123',
  geometry: { longitude: 'source_lon', latitude: 'source_lat' },
  visualizations: {
    radius: { value: 5 },
    fill: {
      value: [182, 38, 40],
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        name: 'source_poi_name',
        id: 'source_poi_id',
        metricKeys: ['source_lon', 'source_lat'],
      },
    },
  },
}

const ScatterPlotLayer2Config = {
  layer: 'scatterplot',
  dataId: 'xwiReport-123',
  geometry: { longitude: 'target_lon', latitude: 'target_lat' },
  visualizations: {
    radius: { value: 5 },
    fill: {
      value: [251, 201, 78],
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        name: 'target_poi_name',
        id: 'target_poi_id',
        metricKeys: ['target_lon', 'target_lat'],
      },
    },
  },
}

const WIReportLayerConfig = {
  layer: 'scatterplot',
  dataId: 'wiReportData-123',
  geometry: { longitude: 'lon', latitude: 'lat' },
  visualizations: {
    radius: {
      value: { field: 'visits' },
      dataScale: 'linear',
    },
    fill: {
      value: { field: 'repeat_visitors' },
      dataScale: 'linear',
    },
  },
  interactions: {
    // tooltip: true,
    tooltip: {
      // tooltipNode: null,
      tooltipKeys: {
        name: 'name',
        id: 'poi_id',
        // metricKeys: [],
        // nameAccessor: () => {},
        // idAccessor: () => {},
        // metricAccessor: () => {},
      },
      // formatTooltipTitle: () => {},
      // tooltipProps: {},
    },
  },
  legend: { showLegend: true },
  // formatData: () => {},
  // formatPropertyLabel: () => {},
  // metricAliases: {},
  opacity: 0.5,
}
const WIReportLabelLayerConfig = {
  layer: 'text',
  dataId: 'wiReportData-123',
  geometry: { longitude: 'lon', latitude: 'lat' },
  visualizations: {
    text: {
      value: {
        title: 'poi_id',
        valueKeys: ['visits', 'repeat_visitors'],
      },
    },
  },
  schemeColor: [97, 21, 143],
  opacity: 1,
}

const selectLayerConfig = {
  layer: 'select',
  dataId: 'select-123',
  layerMode: 'circle',
  visualizations: {
    fill: {
      value: [229, 118, 99],
    },
  },
  interactions: {},
  opacity: 0.2,
}

const MVTLayerConfig = {
  layer: 'MVT',
  dataId: 'mvt-123',
  visualizations: {
    fill: {
      value: { field: 'value' },
      valueOptions: [[247, 254, 236], [10, 97, 11]],
      dataScale: 'linear',
    },
    // value key here helps the property of an MVT polygon with no data to be set transparent
    lineColor: {
      value: {
        field: 'value',
        customValue: [21, 116, 15],
      },
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        id: 'id',
        metricKeys: ['value'],
        metricAccessor: d => d.properties,
      },
    },
  },
  opacity: 0.2,
  legend: { showLegend: true },
  metricAliases: { value: 'Median Income' },
  formatData: { value: d => '$' + d },
}

const GeoJSONMVTConfig = {
  layer: 'geojson',
  dataId: 'mvt-123',
  dataPropertyAccessor: d => d.properties,
  geometry: { geoKey: 'geo_id' },
  visualizations: {
    fill: {
      value: { field: 'value' },
      valueOptions: [[173, 214, 250], [24, 66, 153]],
      dataScale: 'linear',
    },
    elevation: {
      value: { field: 'value' },
      valueOptions: [0, 1000],
      dataScale: 'linear',
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        name: 'geo_id',
        metricAccessor: d => d.properties,
      },
    },
  },
  opacity: 0.5,
  legend: { showLegend: true },
}

const GeoJSONfsaMVTConfig = {
  layer: 'geojson',
  dataId: 'fsa-geojson-123',
  dataPropertyAccessor: d => d.properties,
  geometry: { geoKey: 'geo_ca_fsa' },
  visualizations: {
    fill: {
      value: { field: 'visits' },
      valueOptions: [[173, 214, 250], [24, 66, 153]],
      dataScale: 'linear',
    },
    elevation: {
      value: { field: 'unique_visitors' },
      valueOptions: [0, 40000],
      dataScale: 'linear',
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        name: 'geo_ca_fsa',
        metricKeys: ['visits', 'unique_visitors'],
        metricAccessor: d => d.properties,
      },
    },
  },
  visible: true,
  opacity: 0.3,
  legend: { showLegend: true },
}

const GeoJSONMVTLabelConfig = {
  layer: 'geojson',
  dataId: 'fsa-geojson-123',
  dataPropertyAccessor: d => d.properties,
  geometry: { geoKey: 'geo_ca_fsa' },
  visualizations: {
    fill: {
      value: { field: 'visits' },
      valueOptions: [[173, 214, 250], [24, 66, 153]],
      dataScale: 'linear',
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        name: 'geo_ca_fsa',
        metricKeys: ['visits'],
        metricAccessor: d => d.properties,
      },
    },
  },
  visible: true,
  opacity: 0.3,
  legend: { showLegend: true },
}

const textGeoJSONMVTConfig = {
  layer: 'text',
  dataId: 'fsa-geojson-123',
  dataPropertyAccessor: d => d.properties,
  geometry: {
    geoKey: 'geo_ca_fsa',
    longitude: 'longitude',
    latitude: 'latitude',
    geometryAccessor: d => d.properties,
  },
  visualizations: {
    text: {
      value: {
        title: 'geo_ca_fsa',
        valueKeys: ['visits'],
      },
    },
    pixelOffset: { value: [0, 0] },
  },
}

const Template = (args) => <LocusMap { ...args } />

const geojsonArgs = {
  layerConfig: [GeoJSONLayerConfig],
  dataConfig,
  mapConfig: { ...mapConfig, legendSize: 'sm', legendPosition: 'bottom-left' },
}

export const GeoJSONLayer = Template.bind({})
GeoJSONLayer.args = geojsonArgs
GeoJSONLayer.storyName = 'GeoJSON Layer for POIs - widget-size Legend'

const geojsonSchemeColourArgs = {
  layerConfig: [{ ...GeoJSONLayerConfig, schemeColor: '#167108' }, textGeoJSONLayerConfig],
  dataConfig,
  mapConfig,
}

export const GeoJSONLayerSchemeColour = Template.bind({})
GeoJSONLayerSchemeColour.args = geojsonSchemeColourArgs
GeoJSONLayerSchemeColour.storyName = 'GeoJSON Layer with string format scheme colour & Text Layer for labels'

const polygonGeojsonArgs = {
  layerConfig: [polygonGeoJSONLayerConfig, polygonTextGeoJSONLayerConfig],
  dataConfig,
  mapConfig,
}

export const polygonGeoJSONLayer = Template.bind({})
polygonGeoJSONLayer.args = polygonGeojsonArgs
polygonGeoJSONLayer.storyName = 'GeoJSON Polygon Layer with Text Layer for labels'

const scatterplotArgs = { layerConfig: [WIReportLayerConfig], dataConfig, mapConfig }

export const ScatterplotLayer = Template.bind({})
ScatterplotLayer.args = scatterplotArgs
ScatterplotLayer.storyName = 'Scatterplot Layer for WI & VWI reports with default values for radius & fill'

const scatterplotSchemeColourArgs = {
  layerConfig: [{ ...WIReportLayerConfig, schemeColor: [97, 21, 143] }, WIReportLabelLayerConfig],
  dataConfig,
  mapConfig,
}

export const ScatterplotLayerSchemeColour = Template.bind({})
ScatterplotLayerSchemeColour.args = scatterplotSchemeColourArgs
ScatterplotLayerSchemeColour.storyName = 'Scatterplot Layer with array format scheme colour and Text Layer for labels'

const xwiReportArgs = {
  layerConfig: [arcLayerConfig, ScatterPlotLayer1Config, ScatterPlotLayer2Config],
  dataConfig,
  mapConfig,
}

export const XWIReportLayers = Template.bind({})
XWIReportLayers.args = xwiReportArgs
XWIReportLayers.storyName = 'Arc & Scatterplot Layers for XWI Reports'

let initViewState = {
  latitude: 43.41,
  longitude: -79.23,
  zoom: 8.6,
}

const MVTLayerArgs = {
  layerConfig: [MVTLayerConfig],
  dataConfig,
  mapConfig: { ...mapConfig, initViewState },
}

export const MVTLayer = Template.bind({})
MVTLayer.args = MVTLayerArgs
MVTLayer.storyName = 'MVT Layer with demographic data'

const GeoJSONMVTArgs = {
  layerConfig: [GeoJSONMVTConfig],
  dataConfig,
  mapConfig: { ...mapConfig, initViewState, pitch: 45 },
}

export const GeoJSONMVTLayer = Template.bind({})
GeoJSONMVTLayer.args = GeoJSONMVTArgs
GeoJSONMVTLayer.storyName = 'GeoJSON CT polygon Layer with MVT geometry data'

initViewState = {
  latitude: 44.41,
  longitude: -79.23,
  zoom: 7,
}

const GeoJSONfsaMVTArgs = {
  layerConfig: [GeoJSONfsaMVTConfig],
  dataConfig,
  mapConfig: { ...mapConfig, initViewState, pitch: 45 },
}

export const GeoJSONfsaMVTLayer = Template.bind({})
GeoJSONfsaMVTLayer.args = GeoJSONfsaMVTArgs
GeoJSONfsaMVTLayer.storyName = 'GeoJSON FSA Polygon Layer with MVT geometry data'

const GeoJSONMVTLabelArgs = {
  layerConfig: [GeoJSONMVTLabelConfig, textGeoJSONMVTConfig],
  dataConfig,
  mapConfig: { ...mapConfig, initViewState },
}

export const GeoJSONMVTLabelLayer = Template.bind({})
GeoJSONMVTLabelLayer.args = GeoJSONMVTLabelArgs
GeoJSONMVTLabelLayer.storyName = 'GeoJSON FSA polygon Layer with MVT geometry data & Text Layer for labels'

export const SelectDataLayer = () => {
  const [selectShape, setSelectShape] = useState('circle')

  const selectArgs = {
    layerConfig: [{ ...selectLayerConfig, layerMode: selectShape }, GeoJSONLayerConfig],
    dataConfig,
    mapConfig: { ...mapConfig, legendPosition: 'bottom-right' },
  }

  return (
    <div>
      <p style={ { color: 'red' } }>FIRST: choose shape to select data!</p>
      <SelectButtonGroup setSelectShape={ setSelectShape } />
      <LocusMap { ...selectArgs } />
    </div>
  )
}
SelectDataLayer.storyName = 'Select data on map by drawing shapes'

const layerConfig = [
  selectLayerConfig,
  MVTLayerConfig,
  GeoJSONLayerConfig,
  arcLayerConfig,
  ScatterPlotLayer1Config,
  ScatterPlotLayer2Config,
]

export const NoLegendNoTooltip = Template.bind({})
NoLegendNoTooltip.args = {
  ...scatterplotArgs,
  mapConfig: { ...mapConfig, showMapLegend: false, showMapTooltip: false },
}
NoLegendNoTooltip.storyName = 'Map with disabled legend & tooltip'

const mapArgs = {
  layerConfig,
  dataConfig,
  mapConfig,
}

export const AllLayers = Template.bind({})
AllLayers.args = mapArgs

const noDataConfig = [
  { id: 'xwiReport-123', data: [] },
  { id: 'wiReportData-123', data: [] },
  { id: 'poiGeojson-123', data: [] },
  {
    id: 'mvt-123',
    data: {
      tileGeom: 'https://mapsource-dev.locus.place/maps/ct/{z}/{x}/{y}.vector.pbf?',
      tileData: [],
    },
  },
  {
    id: 'fsa-geojson-123',
    data: {
      tileGeom: 'https://mapsource.locus.place/maps/fsa/{z}/{x}/{y}.vector.pbf?',
      tileData: [],
    },
  },
  { id: 'select-123', data: [] },
]

const noDataArgs = {
  layerConfig,
  dataConfig: noDataConfig,
  mapConfig,
}

export const NoData = Template.bind({})
NoData.args = noDataArgs
