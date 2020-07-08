/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import DeckMap from '../src/components/deck'
import POIsRadii from './data/pois-radii'

storiesOf('Deck', module)
  .add('DeckMap empty', () => (
    <DeckMap/>
  ))
  .add('DeckMap POI no cluster', () => (
    <DeckMap poiData={ POIsRadii }/>
  ))
