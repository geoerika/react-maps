/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { POIMap, POIMapActivePOI } from '../src'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radii-to'
import POIsPolygonsVanData from './data/pois-polygons-van'
import POIsPolygonTorontoData from './data/pois-polygon-toronto.json'


// create GeoJSON format for polygon data
const POIsPolygonsVan = POIsPolygonsVanData.map((polygon) =>
  ({ ...polygon, geometry: JSON.parse(polygon.properties.polygon_json) }))
const POIsPolygonToronto = POIsPolygonTorontoData.map((polygon) =>
  ({ ...polygon, geometry: JSON.parse(polygon.properties.polygon_json) }))

storiesOf('POI Map', module)
  .add('Point POIs - clusters with POICluster layer', () => (
    <POIMap POIData={ POIsRadii } mode='display' cluster={ true }/>
  ))
  .add('Point POIs - radii & icons with POIIcon & POIGeoJson layers', () => (
    <POIMap POIData={ POIsRadiiTo } mode='display'/>
  ))
  .add('Point POIs - one POI to check zoom', () => (
    <POIMap POIData={ [POIsRadiiTo[0]] } mode='display'/>
  ))
  .add('Point POIs - POIManage: activePOI and radius change', () => (
    <POIMapActivePOI POIData={ POIsRadiiTo }/>
  ))
  .add('Polygon POIs - POIGeoJson layer', () => (
    <POIMap POIData={ POIsPolygonsVan } mode='display'/>
  ))
  .add('Edit Radius POIs - POIEditDraw layer', () => (
    <POIMap
      activePOI={ POIsRadiiTo[0] }
      mode='edit'
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Edit Polygon POIs - POIEditDraw layer', () => (
    <POIMap
      activePOI={ POIsPolygonToronto[0] }
      mode='edit'
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Point POIs - POIEditDraw layer', () => (
    <POIMap 
      POIData={ [] }
      mode={ 'point-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Polygon POIs - POIEditDraw layer', () => (
    <POIMap 
      POIData={ [] }
      mode={ 'polygon-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
