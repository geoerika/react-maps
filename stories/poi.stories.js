/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { POIMap, POIMapActivePOI } from '../src'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'
import POIsPolygonsVan from './data/pois-polygons-van'

storiesOf('POI', module)
  .add('POI map - icon', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['icon'] }/>
  ))
  .add('POI map - cluster', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['cluster'] }/>
  ))
  .add('POI maps - radii', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['geojson'] }/>
  ))
  .add('POI maps - radii & icons', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['geojson', 'icon'] }/>
  ))
  .add('POI maps - radii one POI', () => (
    <POIMap POIData={ [POIsRadiiTo[0]] } layerArray={ ['geojson', 'icon'] }/>
  ))
  .add('POI maps - active POI', () => (
    <POIMapActivePOI POIData={ POIsRadiiTo }/>
  ))
  .add('POI maps - polygons', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['polygon'] }/>
  ))
  .add('POI maps - point drawing layer', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POI_draw'] }
      mode={ 'point-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('POI maps - polygon drawing layer', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POI_draw'] }
      mode={ 'polygon-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
