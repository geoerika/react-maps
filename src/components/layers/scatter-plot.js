import React from 'react'
import PropTypes from 'prop-types'

// https://deck.gl/docs/api-reference/layers/scatterplot-layer
import { ScatterplotLayer } from 'deck.gl'


const Scatterplot = props => (
  new ScatterplotLayer(props)
)

export default Scatterplot