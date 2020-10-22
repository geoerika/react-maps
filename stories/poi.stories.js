/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { POIMap, POIMapActivePOI } from '../src'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'
import POIsPolygonsVan from './data/pois-polygons-van'

storiesOf('POI Map', module)
  .add('Point POIs - icon layer', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['icon'] }/>
  ))
  .add('Point POIs - cluster layer', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['cluster'] }/>
  ))
  .add('Point POIs - radii with geojson layer', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['geojson'] }/>
  ))
  .add('Point POIs - radii & icons', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['geojson', 'icon'] }/>
  ))
  .add('Point POIs - one POI to check zoom', () => (
    <POIMap POIData={ [POIsRadiiTo[0]] } layerArray={ ['geojson', 'icon'] }/>
  ))
  .add('Point POIs - POIManage: active POI and radius change', () => (
    <POIMapActivePOI POIData={ POIsRadiiTo }/>
  ))
  .add('Polygon POIs - poi-polygon layer', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['polygon'] }/>
  ))
  .add('Polygon POIs - geojson layer', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['geojson'] }/>
  ))
  .add('Edit Point POIs - geojson layer', () => (
    <POIMap
      POIData={ [POIsRadiiTo[0]] }
      layerArray={ ['POI_edit_draw'] }
      mode={ 'POI-edit' }
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Edit Polygon POIs - geojson layer', () => (
    <POIMap
      POIData={ [POIsPolygonsVan[0]] }
      layerArray={ ['POI_edit_draw'] }
      mode={ 'POI-edit' }
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Point POIs - POI_edit_draw', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POI_edit_draw'] }
      mode={ 'point-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Polygon POIs - POI_edit_draw', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POI_edit_draw'] }
      mode={ 'polygon-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
