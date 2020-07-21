import React, { useState, useRef } from 'react'
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
  tooltipProps: PropTypes.object,
  tooltipNode: PropTypes.node,
}
const defaultProps = {
  layers: [],
  showLegend: false,
  showTooltip: false,
  tooltipProps: {},
}


// DeckGL react component
const Map = ({ layers, showLegend, showTooltip, tooltipNode, tooltipProps, ...legendProps }) => {
  const deckRef = useRef()
  const [{ height, width }, setDimensions] = useState({ height: 0, width: 0 })

  return (
    <MapContainer>
      <DeckGL
        ref={deckRef}
        onLoad={() => {
          const { height, width } = deckRef.current.deck
          setDimensions({ height, width })
        }}
        onResize={({ height, width }) => setDimensions({ height, width })}
        onViewStateChange={({ viewState: { width, height } }) => setDimensions({ height, width })}
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
          h={height}
          w={width}
          {...tooltipProps}
        >
          {tooltipNode}
        </MapTooltip>
      )}
    </MapContainer>
  )
}


Map.propTypes = propTypes
Map.defaultProps = defaultProps

export default Map
