/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import Map from '../src/components/generic-map'

const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN

storiesOf('Deck', module)
  .add('Generic Map', () => (
    <Map mapboxApiAccessToken={ mapboxApiAccessToken }/>
  ))
