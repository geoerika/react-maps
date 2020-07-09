/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import DeckMap from '../src/components/deck'
import POIsRadii from './data/pois-radii'

storiesOf('POI', module)
  .add('POI map - no cluster', () => (
    <DeckMap poiData={ POIsRadii }/>
  ))
  .add('POI map - cluster', () => (
    <DeckMap poiData={ POIsRadii } cluster={ true }/>
  ))
