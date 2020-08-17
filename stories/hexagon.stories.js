/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import HexagonMap from '../src/components/hexagon-map'


storiesOf('Hexagon Map', module)
  .add('Basic rendering', () => (
    <HexagonMap showLegend />
  ))
