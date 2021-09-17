import React, { useState, useEffect, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'

import { setView, parseDeckGLLayerFromConfig } from './utils'
import Map from '../generic-map'


const propTypes = {
  dataConfig: PropTypes.array.isRequired,
  layerConfig: PropTypes.array.isRequired,
  mapProps: PropTypes.object,
}

const defaultProps = {
  dataConfig: [],
  layerConfig: [],
  mapProps: {},
}

const LocusMap = ({
  dataConfig,
  layerConfig,
  ...mapProps
}) => {
  const [viewStateOverride, setViewOverride] = useState({})
  const [{ height, width }, setDimensions] = useState({})
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [selectShape, setSelectShape] = useState([])

  // set controller for Map comp
  const controller = useMemo(() => {
    const layerList = layerConfig.reduce((agg, layer) => [...agg, layer.layer], [])
    if (layerList?.includes('select' )) {
      return { doubleClickZoom: false }
    }
    return { controller: true }
  }, [layerConfig])

  // set state for layers and data
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
            deckLayer: parseDeckGLLayerFromConfig({
              ...layer,
              selectedFeatureIndexes,
              setSelectShape,
              id,
            })(data[dataIdMap[layer.dataId]]),
          },
        }
      }, {})
      return {
        ...state,
        data,
        layers,
      }
    }

    if (type === 'select') {
      const { data } = payload
      const { layers } = state
      let selectLayer = {}

      for (const id in layers) {
        if (layers[id].config.layer === 'select') {
          selectLayer = {
            [id]: {
              ...layers[id],
              deckLayer: parseDeckGLLayerFromConfig({
                ...layers[id].config,
                id,
                selectedFeatureIndexes,
                setSelectShape,
              })(data),
            },
          }
        }
      }
      return {
        ...state,
        layers: {
          ...layers,
          ...selectLayer,
        },
      }
    }

    return state
  }, { data: {}, layers: {} })

  // set initial layers and their corresponding data
  useEffect(() => {
    configurableLayerDispatch({ type: 'init', payload: { layerConfig, dataConfig } })
  }, [layerConfig, dataConfig])

  // adjust viewport based on data
  useEffect(() => {
    if (width && height) {
      // recenter based on data
      let dataGeomList = []
      layerConfig.forEach(layer => {
        if (!['arc', 'MVT', 'select'].includes(layer.layer)) {
          const data = dataConfig.filter(elem => elem.id === layer.dataId)[0].data
          dataGeomList = [...dataGeomList, { data, ...layer.geometry }]
        }
      })
      const dataView = dataGeomList?.length ? setView({ dataGeomList, width, height }) : {}
      // don't adjust viewport when we select data on map by drawing shapes
      if (!selectShape.length ) {
        setViewOverride(o => ({
          ...o,
          ...dataView,
        }))
      }
    }
  }, [dataConfig, layerConfig, selectShape, height, width])

  // update state for 'select' layer
  useEffect(() => {
    const selectActive = layerConfig.find(layer => layer.layer === 'select')
    if (selectActive && selectShape.length) {
      setSelectedFeatureIndexes([0])
      configurableLayerDispatch({ type: 'select', payload: { data: selectShape } })
    }
  }, [layerConfig, selectShape])

  return (
    <Map
      layers={Object.values(layers).map(o => o.deckLayer)}
      setDimensionsCb={(o) => setDimensions(o)}
      viewStateOverride={viewStateOverride}
      controller={controller}
      { ...mapProps }
    />
  )
}

LocusMap.propTypes = propTypes
LocusMap.defaultProps = defaultProps

export default LocusMap
