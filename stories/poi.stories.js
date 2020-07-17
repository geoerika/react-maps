/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import DeckMap from '../src/components/deck'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'

storiesOf('POI', module)
  .add('POI map - no cluster', () => (
    <DeckMap poiData={ POIsRadii } layerArray={ ['icon'] }/>
  ))
  .add('POI map - cluster', () => (
    <DeckMap poiData={ POIsRadii } layerArray={ ['cluster'] }/>
  ))
  .add('POI maps - radii', () => (
    <DeckMap poiData={ POIsRadiiTo } layerArray={ ['geojson'] }/>
  ))
