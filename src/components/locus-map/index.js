import React, { useState, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'

import { setView, parseDeckGLLayerFromConfig } from './utils'
import Map from '../generic-map'


const propTypes = {
  dataConfig: PropTypes.array.isRequired,
  layerConfig: PropTypes.array.isRequired,
  mapboxApiAccessToken: PropTypes.string.isRequired,
}

const defaultProps = {
  dataConfig: [],
  layerConfig: [],
  mapboxApiAccessToken:'no-token',
}

const LocusMap = ({
  dataConfig,
  layerConfig,
  mapboxApiAccessToken,
}) => {
  const [viewStateOverride, setViewOverride] = useState({})
  const [{ height, width }, setDimensions] = useState({})

  useEffect(() => {
    configurableLayerDispatch({ type: 'init', payload: { layerConfig, dataConfig } })
  }, [layerConfig, dataConfig])

  useEffect(() => {
    if (width && height) {
      // recenter based on data
      let dataGeomList = []
      layerConfig.forEach(layer => {
        if (layer.layer !== 'arc') {
          const data = dataConfig.filter(elem => elem.id === layer.dataId)[0].data
          dataGeomList = [...dataGeomList, { data, ...layer.geometry }]
        }
      })
      const dataView = setView({ dataGeomList, width, height })
      setViewOverride(o => ({
        ...o,
        ...dataView,
      }))
    }
  }, [dataConfig, layerConfig, height, width])


  const [{ layers }, configurableLayerDispatch] = useReducer((state, { type, payload }) => {
    if (type === 'init') {
      const { dataConfig, layerConfig } = payload
      // ====[NOTE] ids are for single-use sessions
      // ====[TODO] more thorough ID functions
      const dataIdMap = {}
      const data = dataConfig.reduce((agg, { id, data }, i) => {
        const newId = `data-${new Date().getTime()}-${i}`
        dataIdMap[id] = newId
        return {
          ...agg,
          [newId]: data,
        }
      }, {})

      const layers = layerConfig.reduce((agg, layer, i) => {
        const id = `layer-${new Date().getTime()}-${i}`
        // ====[TODO] fallback for invalid/missing dataId
        return {
          ...agg,
          [id]: {
            config: layer,
            deckLayer: parseDeckGLLayerFromConfig({ ...layer, id })(data[dataIdMap[layer.dataId]]) },
        }
      }, {})
      return {
        ...state,
        data,
        layers,
      }
    }
    return state
  }, { data: {}, layers: {} })

  return (
    <Map
      layers={Object.values(layers).map(o => o.deckLayer)}
      setDimensionsCb={(o) => setDimensions(o)}
      viewStateOverride={viewStateOverride}
      mapboxApiAccessToken={mapboxApiAccessToken}
    />
  )
}

LocusMap.propTypes = propTypes
LocusMap.defaultProps = defaultProps

export default LocusMap
