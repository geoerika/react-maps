/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import POIMap from '../src/components/poi-map'
import Map from '../src/components/generic-map'


storiesOf('Deck', module)
  .add('POIMap empty', () => (
    <POIMap/>
  ))
  .add('Generic Map', () => (
    <Map />
  ))
