/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { HexagonMap } from '../src'


storiesOf('Hexagon Map', module)
  .add('Basic rendering', () => (
    <HexagonMap showLegend />
  ))
