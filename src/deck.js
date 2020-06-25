import React from 'react'

import DeckGL from '@deck.gl/react'
import { LineLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'

// Viewport settings
const viewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
}

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781],
  },
]

// DeckGL react component
const Deck = (props) => {
  const layers = [
    new LineLayer({ id: 'line-layer', data }),
  ]

  return (
    <DeckGL
      viewState={viewState}
      layers={layers}
    >
      <StaticMap {...props} />
    </DeckGL>
  )
}

export default Deck
