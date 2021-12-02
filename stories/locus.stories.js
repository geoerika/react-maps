import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined'
import AddBoxOutlined from '@material-ui/icons/AddBoxOutlined'
import AddOutlined from '@material-ui/icons/AddOutlined'

import { Button } from '@eqworks/lumen-ui'

import { LocusMap } from '../src'
import { getCursor } from '../src/utils'

import poiRadiiTo from './data/pois-radii-to.json'
import wiReportData from './data/wi-report.json'
import xwiReportData from './data/xwi-report.json'
import mvtData from './data/locus-map-mvt.json'


const basicIconButtonStyle = {
  paddingLeft: '20px',
  maxWidth: '35px',
  minWidth: '35px',
  maxHeight: '30px',
  minHeight: '30px',
}

const StyledButtonSelect = withStyles({
  root: basicIconButtonStyle,
})(Button)

const SelectButtonGroup = ({ setSelectShape }) => {
  return (
    <ButtonGroup orientation='horizontal'>
      <StyledButtonSelect
        startIcon={ <AddCircleOutlineOutlined />}
        size='small'
        type='secondary'
        color='primary'
        onClick={() => setSelectShape('circle')}
      />
      <StyledButtonSelect
        startIcon={<AddBoxOutlined />}
        size='small'
        type='secondary'
        color='primary'
        onClick={() => setSelectShape('rectangle')}
      />
      <StyledButtonSelect
        startIcon={<AddOutlined />}
        size='small'
        type='secondary'
        color='primary'
        onClick={() => setSelectShape('polygon')}
      />
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
  legendSize: 'full',
  mapboxApiAccessToken,
}

const dataConfig = [
  { id: 'xwiReport-123', data: xwiReportData },
  { id: 'wiReportData-123', data: wiReportData },
  { id: 'poiGeojson-123', data: poiRadiiTo },
  { id: 'mvt-123',
    data: {
      tileGeom: 'https://mapsource.locus.place/maps/ct/{z}/{x}/{y}.vector.pbf?',
      tileData: mvtData,
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
      valueOptions: [5, 15],
      dataScale: 'linear',
    },
    fill: {
      value: { field: 'repeat_visitors' },
      valueOptions: [[214, 232, 253], [39, 85, 196]],
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

const selectLayerConfig = {
  layer: 'select',
  dataId: 'select-123',
  layerMode: 'circle',
  visualizations: {},
  interactions: {},
  opacity: 0.5,
}

const MVTLayerConfig = {
  layer: 'MVT',
  dataId: 'mvt-123',
  visualizations: {
    fill: {
      value: { field: 'value' },
      valueOptions: [[ 247, 254, 236], [10, 97, 11]],
      dataScale: 'linear',
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
      valueOptions: [[ 173, 214, 250], [ 24, 66, 153]],
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
        metricKeys: ['value'],
        metricAccessor: d => d.properties,
      },
    },
  },
  opacity: 0.5,
  legend: { showLegend: true },
}

const Template = (args) => <LocusMap {...args} />

const geojsonArgs = {
  layerConfig: [GeoJSONLayerConfig],
  dataConfig,
  mapConfig: { ...mapConfig, legendSize: 'widget' },
}

export const GeoJSONLayer = Template.bind({})
GeoJSONLayer.args = geojsonArgs
GeoJSONLayer.storyName = 'GeoJSON Layer for POIs - widget-size Legend'

const scatterplotArgs = { layerConfig: [WIReportLayerConfig], dataConfig, mapConfig }

export const ScatterplotLayer = Template.bind({})
ScatterplotLayer.args = scatterplotArgs
ScatterplotLayer.storyName = 'Scatterplot Layer for WI & VWI reports'

const xwiReportArgs = {
  layerConfig: [arcLayerConfig, ScatterPlotLayer1Config, ScatterPlotLayer2Config],
  dataConfig,
  mapConfig,
}

export const XWIReportLayers = Template.bind({})
XWIReportLayers.args = xwiReportArgs
XWIReportLayers.storyName = 'Arc & Scatterplot Layers for XWI Reports'

const initViewState = {
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
GeoJSONMVTLayer.storyName = 'GeoJSON polygon Layer with MVT tile geometry data'

export const SelectDataLayer = () => {
  const [selectShape, setSelectShape] = useState('circle')

  const selectArgs = {
    layerConfig: [{ ...selectLayerConfig, layerMode: selectShape }, GeoJSONLayerConfig],
    dataConfig,
    mapConfig: { ...mapConfig, legendPosition: 'bottom-right' },
  }

  return (
    <div>
      <p style={{ color: 'red' }}>FIRST: choose shape to select data!</p>
      <SelectButtonGroup setSelectShape={setSelectShape} />
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
  { id: 'mvt-123',
    data: {
      tileGeom: 'https://mapsource-dev.locus.place/maps/ct/{z}/{x}/{y}.vector.pbf?',
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
