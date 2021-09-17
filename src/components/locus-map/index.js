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

  const controller = useMemo(() => {
    const layerList = layerConfig.reduce((agg, layer) => [...agg, layer.layer], [])
    if (layerList?.includes('select' )) {
      return { doubleClickZoom: false }
    }
    return { controller: true }
  }, [layerConfig])

  useEffect(() => {
    configurableLayerDispatch({ type: 'init', payload: { layerConfig, dataConfig } })
  }, [layerConfig, dataConfig, selectShape])

  useEffect(() => {
    if (width && height) {
      // recenter based on data
      let dataGeomList = []
      layerConfig.forEach(layer => {
        if (!['arc', 'MVT', 'select'].includes(layer.layer)) {
          const data = dataConfig.filter(elem => elem.id === layer.dataId)[0].data
          dataGeomList = [...dataGeomList, { data, ...layer.geometry }]
        }
        if (layer.layer === 'select') {
          setSelectedFeatureIndexes([0])
        }
      })
      const dataView = dataGeomList?.length ? setView({ dataGeomList, width, height }) : {}
      setViewOverride(o => ({
        ...o,
        ...dataView,
      }))
    }
  }, [dataConfig, layerConfig, selectShape, height, width])


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
            })(layer.layer === 'select' ? selectShape : data[dataIdMap[layer.dataId]]) },
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
      controller={controller}
      { ...mapProps }
    />
  )
}

LocusMap.propTypes = propTypes
LocusMap.defaultProps = defaultProps

export default LocusMap
