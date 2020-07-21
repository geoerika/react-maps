/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import DeckMap from '../src/components/deck'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'
import POIsPolygonsVan from './data/pois-polygons-van'

storiesOf('POI', module)
  .add('POI map - icon', () => (
    <DeckMap poiData={ POIsRadii } layerArray={ ['icon'] }/>
  ))
  .add('POI map - cluster', () => (
    <DeckMap poiData={ POIsRadii } layerArray={ ['cluster'] }/>
  ))
  .add('POI maps - radii', () => (
    <DeckMap poiData={ POIsRadiiTo } layerArray={ ['geojson'] }/>
  ))
  .add('POI maps - radii & icons', () => (
    <DeckMap poiData={ POIsRadiiTo } layerArray={ ['geojson', 'icon'] }/>
  ))
  .add('POI maps - polygons', () => (
    <DeckMap poiData={ POIsPolygonsVan } layerArray={ ['polygon'] }/>
  ))
