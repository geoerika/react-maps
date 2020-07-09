/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import DeckMap from '../src/components/deck'

storiesOf('Deck', module)
  .add('DeckMap empty', () => (
    <DeckMap/>
  ))