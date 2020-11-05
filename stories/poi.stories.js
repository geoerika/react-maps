/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { POIMap, POIMapActivePOI } from '../src'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'
import POIsPolygonsVan from './data/pois-polygons-van'

storiesOf('POI Map', module)
  .add('Point POIs - icons with POIIcon layer', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['POIIcon'] }/>
  ))
  .add('Point POIs - clusters with POICluster layer', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['POICluster'] }/>
  ))
  .add('Point POIs - radii with POIGeoJson layer', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['POIGeoJson'] }/>
  ))
  .add('Point POIs - radii & icons', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['POIGeoJson', 'POIIcon'] }/>
  ))
  .add('Point POIs - one POI to check zoom', () => (
    <POIMap POIData={ [POIsRadiiTo[0]] } layerArray={ ['POIGeoJson', 'POIIcon'] }/>
  ))
  .add('Point POIs - POIManage: activePOI and radius change', () => (
    <POIMapActivePOI POIData={ POIsRadiiTo }/>
  ))
  .add('Polygon POIs - POIPolygon layer', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['POIPolygon'] }/>
  ))
  .add('Polygon POIs - POIGeoJson layer', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['POIGeoJson'] }/>
  ))
  .add('Edit Point POIs - POIEditDraw layer', () => (
    <POIMap
      POIData={ [POIsRadiiTo[0]] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'poi-edit' }
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Edit Radius POIs - POIEditDraw layer', () => (
    <POIMap
      activePOI={ POIsRadiiTo[0] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'poi-point-radius-edit' }
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Edit Polygon POIs - POIEditDraw layer', () => (
    <POIMap
      POIData={ [POIsPolygonsVan[0]] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'poi-edit' }
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Point POIs - POIEditDraw layer', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'point-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Polygon POIs - POIEditDraw layer', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'polygon-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
