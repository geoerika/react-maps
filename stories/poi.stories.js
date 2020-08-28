/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { POIMap } from '../src'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'
import POIsPolygonsVan from './data/pois-polygons-van'

storiesOf('POI', module)
  .add('POI map - icon', () => (
    <POIMap poiData={ POIsRadii } layerArray={ ['icon'] }/>
  ))
  .add('POI map - cluster', () => (
    <POIMap poiData={ POIsRadii } layerArray={ ['cluster'] }/>
  ))
  .add('POI maps - radii', () => (
    <POIMap poiData={ POIsRadiiTo } layerArray={ ['geojson'] }/>
  ))
  .add('POI maps - radii & icons', () => (
    <POIMap poiData={ POIsRadiiTo } layerArray={ ['geojson', 'icon'] }/>
  ))
  .add('POI maps - polygons', () => (
    <POIMap poiData={ POIsPolygonsVan } layerArray={ ['polygon'] }/>
  ))
  .add('POI maps - point drawing layer', () => (
    <POIMap 
      poiData={ POIsRadiiTo }
      layerArray={ ['poi_draw'] }
      mode={ 'point-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('POI maps - polygon drawing layer', () => (
    <POIMap 
      poiData={ [] }
      layerArray={ ['poi_draw'] }
      mode={ 'polygon-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
