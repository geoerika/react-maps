/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import POIMap from '../src/components/poi-map'
import Map from '../src/components/generic-map'

const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN

storiesOf('Deck', module)
  .add('POIMap generic', () => (
    <POIMap mapboxApiAccessToken={ mapboxApiAccessToken }/>
  ))
  .add('POIMap no data, mode empty', () => (
    <POIMap POIData={ [] } mode={ 'empty' } mapboxApiAccessToken={ mapboxApiAccessToken }/>
  ))
  .add('Generic Map', () => (
    <Map mapboxApiAccessToken={ mapboxApiAccessToken }/>
  ))
