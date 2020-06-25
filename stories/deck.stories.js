/* eslint-disable react/prop-types */
import React from 'react'

import Deck from '../src/deck'


export default {
  title: 'Deck',
  component: Deck,
  decorators: [
    (storyFn) => (
      <div style={{ width: '100%', height: '100vh' }}>
        {storyFn()}
      </div>
    ),
  ],
}

export const normal = () => (
  <Deck mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN} />
)
