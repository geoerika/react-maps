import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import DeckGL, { FlyToInterpolator, MapView } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import styled from 'styled-components'

import MapTooltip from './tooltip'
import Legend from './legend'


const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
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
  showTooltip: PropTypes.bool,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
}
const defaultProps = {
  layers: [],
  showLegend: false,
  showTooltip: false,
  tooltip: undefined,
  tooltipProps: {},
}

// DeckGL react component
const Map = ({ layers, showLegend, showTooltip, tooltip, tooltipProps, ...legendProps }) => {
  const deckRef = useRef(null)
  const [{ h, w }, setDimensions] = useState({ h: 0, w: 0 })
  useEffect(() => {
    if (deckRef && deckRef.current) {
      setDimensions({
        h: deckRef.current.deck.height,
        w: deckRef.current.deck.width,
      })
    }
  }, [deckRef])

  return (
    <MapContainer>
      <DeckGL
        ref={deckRef}
        initialViewState={ INIT_VIEW_STATE }
        views={ MAP_VIEW }
        layers={layers}
        controller={ true }
        getTooltip={({object}) => object && object.properties.address_region}
        // NOTE: same structure as layer click
        // onHover={d => console.log('----> map hover', d)}
        // onClick={d => console.log('----> map click', d)}
      >
        <StaticMap mapboxApiAccessToken={ process.env.MAPBOX_ACCESS_TOKEN } />
      </DeckGL>
      {showLegend && <Legend {...legendProps} />}
      {showTooltip && (
        <MapTooltip
          h={h}
          w={w}
          {...tooltipProps}
        >
          {tooltip}
        </MapTooltip>
      )}
    </MapContainer>
  )
}


Map.propTypes = propTypes
Map.defaultProps = defaultProps

export default Map
