import React, { useState, useCallback, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import {
  commonProps,
  commonDefaultProps,
} from '../shared/map-props'

import { FlyToInterpolator, MapView } from '@deck.gl/core'
import { DeckGL } from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'

import { styled, setup } from 'goober'


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

// DeckGL react component
const Map = ({
  layers,
  setDimensionsCb,
  setHighlightObj,
  getTooltip,
  getCursor,
  viewStateOverride,
  legend,
  onHover,
  showTooltip,
  renderTooltip,
  pitch,
  initViewState,
  setZoom,
  setCurrentViewport,
  controller,
  mapboxApiAccessToken,
}) => {
  const [mapViewState, setMapViewState] = useState({ ...INIT_VIEW_STATE, ...initViewState, pitch })
  const [hoverInfo, setHoverInfo] = useState({})

  useLayoutEffect(() => {
    setMapViewState(o => ({
      ...o,
      ...viewStateOverride,
      pitch,
    }))
  }, [pitch, viewStateOverride])

  /**
   * finalOnHover - React hook that handles the onHover event for deck.gl map
   * @param { object } param - object of deck.gl onHover event
   * @param { object } param.hoverInfo - info of hovered object on map
   */
  const finalOnHover = useCallback(hoverInfo => {
    if (onHover) {
      onHover(hoverInfo)
    }
    if (showTooltip && hoverInfo?.object) {
      setHoverInfo(hoverInfo)
    } else {
      setHoverInfo(null)
    }
  }, [onHover, showTooltip])

  return (
    <MapContainer>
      <DeckGL
        onResize={({ height, width }) => {
          setDimensionsCb({ height, width })
        }}
        onViewStateChange={o => {
          const { viewState, interactionState } = o
          const{ isDragging, inTransition, isZooming, isPanning, isRotating } = interactionState
          setMapViewState(o => ({ ...o, ...viewState }))
          // makes tooltip info disappear when we click and zoom in on a location
          setHoverInfo(null)
          // send zoom and viewState to parent comp
          if (!isDragging || !inTransition || !isZooming || !isPanning || !isRotating) {
            setZoom(viewState.zoom)
            if (viewState.zoom >= 10) {
              setCurrentViewport(viewState)
            }
          }
          // reset highlightObj when we are actively interacting with the map in other ways
          if (isDragging || isZooming || isPanning || isRotating) {
            setHighlightObj(null)
          }
        }}
        initialViewState={mapViewState}
        views={ MAP_VIEW }
        layers={layers}
        controller={controller}
        onHover={finalOnHover}
        getTooltip={getTooltip}
        getCursor={getCursor}
        onClick={({ object }) => {
          if(!object) {
            setHighlightObj(null)
          }
        }}
      >
        <StaticMap mapboxApiAccessToken={mapboxApiAccessToken} />
      </DeckGL>
      {legend}
      {showTooltip && hoverInfo?.object && typeof renderTooltip === 'function' && (
        renderTooltip({ hoverInfo })
      )}
    </MapContainer>
  )
}

Map.propTypes = {
  layers: PropTypes.array,
  setDimensionsCb: PropTypes.func,
  setHighlightObj: PropTypes.func,
  getTooltip: PropTypes.func,
  getCursor: PropTypes.func,
  viewStateOverride: PropTypes.object,
  legend: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
  ]),
  showTooltip: PropTypes.bool,
  renderTooltip: PropTypes.func,
  initViewState: PropTypes.object,
  pitch: PropTypes.number,
  setZoom: PropTypes.func,
  setCurrentViewport: PropTypes.func,
  controller: PropTypes.object,
  ...StaticMap.propTypes,
  ...commonProps,
}

Map.defaultProps = {
  layers: [],
  setDimensionsCb: () => {},
  setHighlightObj: () => {},
  getTooltip: () => {},
  getCursor: () => {},
  viewStateOverride: {},
  legend: undefined,
  showTooltip: false,
  renderTooltip: undefined,
  pitch: 0,
  initViewState: undefined,
  setZoom: () => {},
  setCurrentViewport: () => {},
  controller: { controller: true },
  ...StaticMap.defaultProps,
  ...commonDefaultProps,
}

export default Map
