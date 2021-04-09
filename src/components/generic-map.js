import React, { useState, useCallback, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  commonProps,
  commonDefaultProps,
  typographyPropTypes,
  typographyDefaultProps,
  tooltipPropTypes,
  tooltipDefaultProps,
} from '../shared/map-props'

import { FlyToInterpolator, MapView } from '@deck.gl/core'
import { DeckGL } from '@deck.gl/react'
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
  getCursor: PropTypes.func,
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
  getCursor: () => {},
  viewStateOverride: {},
  showLegend: false,
  position: 'top-left',
  legends: [],
  showTooltip: false,
}

// DeckGL react component
const Map = ({
  layers,
  setDimensionsCb,
  getTooltip,
  getCursor,
  viewStateOverride,
  showLegend,
  position,
  legends,
  onHover,
  showTooltip,
  // tooltipNode,
  tooltipProps,
  typography,
  mapboxApiAccessToken,
}) => {
  const deckRef = useRef()
  const [viewState, setViewState] = useState(INIT_VIEW_STATE)
  const [hoverInfo, setHoverInfo] = useState({})
  useLayoutEffect(() => {
    setViewState(o => ({
      ...INIT_VIEW_STATE,
      ...o,
      ...viewStateOverride,
    }))
  }, [viewStateOverride])

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
        ref={deckRef}
        onLoad={() => {
          const { height, width } = deckRef.current.deck
          setDimensionsCb({ height, width })
        }}
        onResize={({ height, width }) => {
          setDimensionsCb({ height, width })
        }}
        onViewStateChange={o => {
          const { viewState } = o
          setViewState(viewState)
        }}
        initialViewState={viewState}
        views={ MAP_VIEW }
        layers={layers}
        controller={true}
        onHover={finalOnHover}
        getTooltip={getTooltip}
        getCursor={getCursor}
      >
        <StaticMap mapboxApiAccessToken={ mapboxApiAccessToken } />
      </DeckGL>
      {showLegend && <Legend legends={legends} position={position} />}
      {showTooltip && hoverInfo?.object && (
        <MapTooltip
          info={hoverInfo}
          tooltipProps={tooltipProps}
          typography={typography}
        >
          {/* {tooltipNode} */}
        </MapTooltip>
      )}
    </MapContainer>
  )
}


Map.propTypes = {
  ...propTypes,
  ...StaticMap.propTypes,
  ...commonProps,
  ...typographyPropTypes,
  ...tooltipPropTypes,
}
Map.defaultProps = {
  ...defaultProps,
  ...StaticMap.defaultProps,
  ...commonDefaultProps,
  ...typographyDefaultProps,
  ...tooltipDefaultProps,
}

export default Map
