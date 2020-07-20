import React from 'react'
import PropTypes from 'prop-types'

import DeckGL, { FlyToInterpolator, MapView } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import styled from 'styled-components'

import Legend from './legend'


const MapContainer = styled.div`
  height: '100%';
  width: '100%';
  position: 'absolute';
`

const MAP_VIEW = new MapView({ repeat: true });

const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 300,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
}

const propTypes = {
  layers: PropTypes.array,
  showLegend: PropTypes.bool,
}
const defaultProps = {
  layers: [],
  showLegend: false,
}

// DeckGL react component
const Map = ({ layers, showLegend, ...legendProps }) => (
  <MapContainer>
    <DeckGL
      initialViewState={ INIT_VIEW_STATE }
      views={ MAP_VIEW }
      layers={layers}
      controller={ true }
      // NOTE: same structure as layer click
      // onHover={d => console.log('----> map hover', d)}
      // onClick={d => console.log('----> map click', d)}
    >
      <StaticMap mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN } />
    </DeckGL>
    {showLegend && <Legend {...legendProps} />}
  </MapContainer>
)

Map.propTypes = propTypes
Map.defaultProps = defaultProps

export default Map
