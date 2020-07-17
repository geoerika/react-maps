/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import DeckMap from '../src/components/deck'
import Map from '../src/components/generic-map'


storiesOf('Deck', module)
  .add('DeckMap empty', () => (
    <DeckMap/>
  ))
  .add('Generic Map', () => (
    <Map />
  ))