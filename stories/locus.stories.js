import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ButtonGroup, Button } from '@eqworks/lumen-labs'
import { Icons } from '@eqworks/lumen-labs'

import { LocusMap } from '../src'

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
  legendPosition: 'top-right',
  legendSize: 'lg',
  mapboxApiAccessToken,
  setMapInRenderState: () => {},
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

const keyAliases = {
  source_poi_id: 'Source POI ID',
  target_poi_id: 'Target POI ID',
  geo_ca_fsa: 'Geo CA FSA',
}

const GeoJSONLayerConfig = {
  layer: 'geojson',
  dataId: 'poiGeojson-123',
  visualizations: {
    pointRadius: {
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
        tooltipTitle1: 'name',
        tooltipTitle2: 'id',
        metricKeys: ['lon', 'lat'],
      },
    },
  },
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
        tooltipTitle1: 'Address region',
        metricKeys: ['Visits (sum)'],
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
    pixelOffset: { value: [-30, 0] },
    anchor: { value: 'start' },
  },
  keyAliases: {
    'Address region': 'Region',
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
    arcWidth: {
      value: { field: 'xvisit_visits' },
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        tooltipTitle1: 'source_poi_id',
        tooltipTitle2: 'target_poi_id',
        metricKeys: ['xvisit_visits', 'xvisit_unique_visitors'],
      },
    },
  },
  keyAliases,
  legend: {
    showLegend: true,
    layerTitle: 'Arc Layer',
  },
  schemeColor: '#366fe4',
}

const ScatterPlotLayer1Config = {
  layer: 'scatterplot',
  dataId: 'xwiReport-123',
  geometry: { longitude: 'source_lon', latitude: 'source_lat' },
  visualizations: {
    radius: {
      value: { field: 'xvisit_unique_visitors' },
    },
    fill: {
      value: { field: 'xvisit_visits' },
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        tooltipTitle1: 'source_poi_id',
        metricKeys: ['source_lon', 'source_lat'],
      },
    },
  },
  keyAliases,
  legend: {
    showLegend: true,
    layerTitle: 'Source Layer',
  },
  schemeColor: '#366fe4',
}

const ScatterPlotLayer2Config = {
  layer: 'scatterplot',
  dataId: 'xwiReport-123',
  geometry: { longitude: 'target_lon', latitude: 'target_lat' },
  visualizations: {
    radius: {
      value: { field: 'xvisit_unique_visitors' },
    },
    fill: {
      value: { field: 'xvisit_visits' },
    },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        tooltipTitle1: 'target_poi_id',
        metricKeys: ['xvisit_visits'],
      },
    },
  },
  legend: {
    showLegend: true,
    layerTitle: 'Target Layer',
  },
  isTargetLayer: true,
  keyAliases,
  schemeColor: '#366fe4',
}

const IconLayer1Config = {
  layer: 'icon',
  dataId: 'xwiReport-123',
  geometry: { longitude: 'source_lon', latitude: 'source_lat' },
  visualizations: {
    size: { value: 5 },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        sourcePOIId: 'source_poi_id',
        metricKeys: [
          'xvisit_visits',
          'xvisit_unique_visitors',
          'xvisit_unique_visitors_single_visit',
          'xvisit_unique_visitors_multi_visit',
          'xvisit_repeat_visitors',
        ],
      },
    },
  },
  legend: {
    showLegend: true,
    layerTitle: 'Source Layer',
  },
  schemeColor: '#366fe4',
}

const IconLayer2Config = {
  layer: 'icon',
  dataId: 'xwiReport-123',
  geometry: { longitude: 'target_lon', latitude: 'target_lat' },
  visualizations: {
    size: { value: 5 },
  },
  interactions: {
    tooltip: {
      tooltipKeys: {
        targetPOIId: 'target_poi_id',
        metricKeys: [
          'xvisit_visits',
          'xvisit_unique_visitors',
          'xvisit_unique_visitors_single_visit',
          'xvisit_unique_visitors_multi_visit',
          'xvisit_repeat_visitors',
        ],
      },
    },
  },
  legend: {
    showLegend: true,
    layerTitle: 'Target Layer',
  },
  isTargetLayer: true,
  schemeColor: '#366fe4',
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
        tooltipTitle1: 'name',
        tooltipTitle2: 'poi_id',
        metricKeys: ['visits', 'repeat_visitors', 'unique_visitors'],
        // tooltipTitle1Accessor: () => {},
        // tooltipTitle2Accessor: () => {},
        // metricAccessor: () => {},
      },
      // formatTooltipTitle: () => {},
      // tooltipProps: {},
    },
  },
  legend: { showLegend: false },
  // formatDataValue: () => {},
  // formatDataKey: () => {},
  // keyAliases: {},
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
        tooltipTitle1: 'id',
        metricKeys: ['value'],
        metricAccessor: d => d.properties,
      },
    },
  },
  opacity: 0.2,
  legend: { showLegend: true },
  keyAliases: { value: 'Median Income' },
  formatDataValue: { value: d => '$' + d },
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
        tooltipTitle1: 'geo_id',
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
        tooltipTitle1: 'geo_ca_fsa',
        metricKeys: ['visits', 'unique_visitors'],
      },
    },
  },
  keyAliases,
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
        tooltipTitle1: 'geo_ca_fsa',
        metricKeys: ['visits'],
      },
    },
  },
  keyAliases,
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
GeoJSONLayer.storyName = 'GeoJSON Layer for POIs with radius in meters'

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
  layerConfig: [ScatterPlotLayer1Config, ScatterPlotLayer2Config, arcLayerConfig],
  dataConfig,
  mapConfig,
}

export const XWIReportLayers = Template.bind({})
XWIReportLayers.args = xwiReportArgs
XWIReportLayers.storyName = 'Arc & Scatterplot Layers with schemeColor prop for XWI Reports'

const xwiNoValueKeysReportArgs = {
  layerConfig: [
    IconLayer1Config,
    IconLayer2Config,
    {
      ...arcLayerConfig,
      visualizations: {},
      interactions: {
        ...arcLayerConfig.interactions,
        tooltip: {
          tooltipKeys: {
            targetPOIId: 'target_poi_id',
            metricKeys: [
              'xvisit_visits',
              'xvisit_unique_visitors',
              'xvisit_unique_visitors_single_visit',
              'xvisit_unique_visitors_multi_visit',
              'xvisit_repeat_visitors',
            ],
          },
        },
      },
    },
  ],
  dataConfig,
  mapConfig,
}

export const xwiNoValueKeysReport = Template.bind({})
xwiNoValueKeysReport.args = xwiNoValueKeysReportArgs
xwiNoValueKeysReport.storyName = 'Arc & Scatterplot Layers with no values for visualization fields'


let initViewState = {
  latitude: 43.41,
  longitude: -79.23,
  zoom: 8.6,
}

const MVTLayerArgs = {
  layerConfig: [MVTLayerConfig],
  dataConfig,
  mapConfig: { ...mapConfig, initViewState, legendPosition: 'bottom-left' },
}

export const MVTLayer = Template.bind({})
MVTLayer.args = MVTLayerArgs
MVTLayer.storyName = 'MVT Layer with demographic data'

initViewState = {
  latitude: 52.82,
  longitude: -79.83,
  zoom: 3,
}

const GeoJSONMVTArgs = {
  layerConfig: [GeoJSONMVTConfig],
  dataConfig,
  mapConfig: { ...mapConfig, initViewState, pitch: 45 },
}

export const GeoJSONMVTLayer = Template.bind({})
GeoJSONMVTLayer.args = GeoJSONMVTArgs
GeoJSONMVTLayer.storyName = 'GeoJSON CT polygon Layer with MVT geometry data'

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

export const AllLayersExplicitZoomControls = Template.bind({})
AllLayersExplicitZoomControls.args = {
  layerConfig,
  dataConfig,
  mapConfig: {
    ...mapConfig,
    controller: {
      scrollZoom: false,
      doubleClickZoom: true,
    },
  },
}
AllLayersExplicitZoomControls.storyName = 'All layers map with disabled scroll zoom and enabled doubleclick zoom'

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
