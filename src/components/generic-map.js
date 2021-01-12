import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import DeckGL, { FlyToInterpolator, MapView, WebMercatorViewport } from 'deck.gl'
import { StaticMap } from 'react-map-gl'

import { styled, setup } from 'goober'

import MapTooltip from './tooltip'
import Legend from './legend'


setup(React.createElement)

const MapContainer = styled('div')`
  height: 100%;
  width: 100%;
  position: absolute;
`

const MAP_VIEW = new MapView({ repeat: true })

const INIT_VIEW_STATE = {
  pitch: 0,
  bearing: 0,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
  latitude: 52,
  longitude: -100,
  zoom: 2.5,
}

const propTypes = {
  layers: PropTypes.array,
  setDimensionsCb: PropTypes.func,
  getTooltip: PropTypes.func,
  viewStateOverride: PropTypes.object,
  showLegend: PropTypes.bool,
  position: PropTypes.string,
  legends: PropTypes.array,
  showTooltip: PropTypes.bool,
  tooltipNode: PropTypes.node,
}
const defaultProps = {
  layers: [],
  setDimensionsCb: () => {},
  getTooltip: () => {},
  viewStateOverride: {},
  showLegend: false,
  position: 'top-left',
  legends: [],
  showTooltip: false,
}

const getPositionFromLngLat = ({ lngLat, ...viewState }) => new WebMercatorViewport({
  ...viewState,
}).project(lngLat)

// DeckGL react component
const Map = ({
  layers,
  setDimensionsCb,
  getTooltip,
  viewStateOverride,
  showLegend,
  position,
  legends,
  showTooltip,
  tooltipNode,
  mapboxApiAccessToken,
  ...tooltipProps
}) => {
  const deckRef = useRef()
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  useLayoutEffect(() => {
    setViewState(o => ({
      ...INIT_VIEW_STATE,
      ...o,
      ...viewStateOverride,
    }))
  }, [viewStateOverride])

  // TODO: unify management of viewState and expose as callback
  const [{ height, width }, setDimensions] = useState({ height: 0, width: 0 })
  const [{ x, y }, setTooltip] = useState({ x: 0, y: 0 })
  // NOTE: keep tooltip x/y consistent with viewport movement
  useEffect(() => {
    if (tooltipProps.lngLat && deckRef && deckRef.current) {
      const [x, y] = getPositionFromLngLat({
        ...deckRef.current.deck.viewState,
        ...viewState,
        height,
        width,
        lngLat: tooltipProps.lngLat,
      })
      setTooltip({ x, y })
    }
  }, [tooltipProps.lngLat, viewState, height, width, deckRef])
  
  return (
    <MapContainer>
      <DeckGL
        ref={deckRef}
        onLoad={() => {
          const { height, width } = deckRef.current.deck
          setDimensionsCb({ height, width })
          setDimensions({ height, width })
        }}
        onResize={({ height, width }) => {
          // viewState doesn't update dimensions correctly
          setDimensions({ height, width })
        }}
        onViewStateChange={o => {
          const { viewState } = o
          setViewState(viewState)
        }}
        initialViewState={viewState}
        views={ MAP_VIEW }
        layers={layers}
        controller={true}
        getTooltip={getTooltip}
        // NOTE: same structure as layer click
        // onHover={d => console.log('----> map hover', d)}
        // onClick={d => console.log('----> map click', d)}
      >
        <StaticMap mapboxApiAccessToken={ mapboxApiAccessToken } />
      </DeckGL>
      {showLegend && <Legend legends={legends} position={position} />}
      {showTooltip && (
        <MapTooltip
          {...tooltipProps}
          x={x}
          y={y}
          h={height}
          w={width}
        >
          {tooltipNode}
        </MapTooltip>
      )}
    </MapContainer>
  )
}


Map.propTypes = { ...propTypes, ...StaticMap.propTypes }
Map.defaultProps = { ...defaultProps, ...StaticMap.defaultProps }

export default Map
