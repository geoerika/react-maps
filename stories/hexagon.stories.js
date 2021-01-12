/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { HexagonMap } from '../src'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

storiesOf('Hexagon Map', module)
  .add('Basic rendering', () => (
    <HexagonMap showLegend mapboxApiAccessToken={ mapboxApiAccessToken }/>
  ))
