import { DrawCircleByDiameterMode, DrawRectangleMode, DrawPolygonMode } from '@nebula.gl/edit-modes'

import { getSchemeColorValues } from './scheme-color'
import { setFinalLayerDataProperty } from '../../../utils/layer'
import { strToArrayColor } from '../../../utils/color'
import {
  PROP_CONFIGURATIONS,
  LAYER_CONFIGURATIONS,
  LAYER_TYPES,
  PROP_TYPES,
} from '../constants'


/**
 * parseDeckGLLayerFromConfig - sets up layer props & returns deck.gl layer
 * @param { object } param
 * @param { string } param.id - deck.gl layer id
 * @param { object } param.geometry - object of geometry props specific to layer
 * @param { object } param.visualizations - object of layer visualisations
 * @param { object } param.interactions - object of layer interactions (ex: click, tooltip)
 * @param { object } param.others - the rest of layer configurations
 * @returns { instanceOf } { deck.gl Layer } - deck.gl map layer
 */
export const parseDeckGLLayerFromConfig = ({
  id,
  layer,
  geometry,
  visualizations,
  interactions = {},
  setProcessingMapData,
  ...others
}) => {
  const {
    dataPropertyAccessor: layerPropertyAccessor,
    geometry: layerGeom,
    deckGLClass: Layer,
    defaultProps,
    visualizations: layerVisualizations,
  } = LAYER_CONFIGURATIONS[layer]

  const { layerMode, keyAliases, formatDataKey, formatDataValue, isTargetLayer } = others
  const dataPropertyAccessor = others?.dataPropertyAccessor || layerPropertyAccessor
  const geometryAccessor = geometry?.geometryAccessor || layerGeom?.geometryAccessor
  const layerGeometry = geometry || layerGeom
  const mvtGeoKey = geometry?.geoKey || layerGeom?.geoKey

  let mode = null

  switch(layerMode) {
    case 'circle':
      mode = DrawCircleByDiameterMode
      break
    case 'rectangle':
      mode = DrawRectangleMode
      break
    case 'polygon':
      mode = DrawPolygonMode
      break
    default:
      mode = undefined
      break
  }

  // ====[NOTE] if a layer requires explicit geometry (all except GeoJson?)
  // =========] pass its configured values (references to data fields) to final propFn
  let geometryProps = {}
  if (layerGeom?.propName) {
    geometryProps = { [layerGeom.propName]: layerGeom.propFn({ geometryAccessor, ...geometry }) }
  }
  if(layerGeom?.source) {
    geometryProps = {
      [layerGeom.source.propName] : layerGeom.source.propFn({ geometryAccessor, ...geometry.source }),
      [layerGeom.target.propName] : layerGeom.target.propFn({ geometryAccessor, ...geometry.target }),
    }
  }
  if (layer === LAYER_TYPES.MVT) {
    geometryProps = { geoKey: mvtGeoKey, geometryAccessor }
  }

  // signals that MVT tiles are loaded and the Loader in LocusMap can be removed
  const onViewportLoad = tiles => {
    if (tiles?.length) {
      setProcessingMapData(false)
    }
  }

  const { schemeColor } = others
  // generate colours for stroke and fill from the base schemeColour
  const {
    newLineColor,
    newLabelColor,
    newColorValue,
    newTargetColor,
    newTargetLineColor,
    newColorValueOptions,
    newTargetColorValueOptions,
  } = schemeColor ? getSchemeColorValues(schemeColor) : {}

  let extruded, parameters

  // ====[TODO] calculate field extents in advance, so every configurable aspect doesn't need to
  const propsWithData = ({ data, highlightId }) => ({
    // ====[TODO] trim invalid visualization values for a given layer
    ...layerVisualizations.reduce((agg, name) => {
      const config = visualizations[name] || {}
      let { deckGLName, defaultValue, byProducts = {} } = PROP_CONFIGURATIONS[name]

      let value = config?.value
      let valueOptions = config?.valueOptions || defaultValue?.valueOptions

      if (defaultValue && !Array.isArray(defaultValue) && typeof defaultValue === 'object') {
        defaultValue = defaultValue.value
      }

      // change colour values with schemeColour generated colours
      if (!value?.field && schemeColor) {
        if (name === PROP_TYPES.fill || name === PROP_TYPES.color) {
          if (isTargetLayer) {
            value = newTargetColor
          } else {
            value = newColorValue
          }
        }
        if (name === PROP_TYPES.sourceArcColor) {
          value = newColorValue
        }
        if (name === PROP_TYPES.targetArcColor) {
          value = newTargetColor
        }
        if (name === PROP_TYPES.color && layer === LAYER_TYPES.text) {
          value = newLabelColor
        }
      }

      if (value?.field && schemeColor && name === PROP_TYPES.fill) {
        if (isTargetLayer) {
          valueOptions = newTargetColorValueOptions
        } else {
          valueOptions = newColorValueOptions
        }
      }

      if (schemeColor && name === PROP_TYPES.lineColor) {
        if (isTargetLayer) {
          value = newTargetLineColor
          // if MVT layer has value.field but not value.customValue, set customValue to newLineColor
        } else if (layer === LAYER_TYPES.MVT && value?.field && !value?.customValue) {
          value = { ...value, customValue: newLineColor }
        } else {
          value = newLineColor
        }
      }

      // convert color value for text layer in an array format
      if (value && name === PROP_TYPES.color && typeof value === 'string') {
        value = strToArrayColor({ strColor: value })
      }

      /*
       * out of all byProducts, 'extruded' and 'parameters.depthTest' props have to be generally
       * false, except when a layer uses elevation; stroked is by default false in deck.gl layers,
       * however, for LocusMap we set it true unless a user provides a custom value, as with the
       * case for all byProducts
       */
      if (name === PROP_TYPES.elevation) {
        [extruded, parameters] = value?.field ?
          [byProducts.extruded, byProducts.parameters] :
          [defaultProps.extruded, defaultProps.parameters]
      }

      return {
        ...agg,
        [deckGLName]: setFinalLayerDataProperty({
          ...config,
          data,
          value,
          valueOptions,
          defaultValue,
          dataPropertyAccessor,
          mvtGeoKey,
          geometryAccessor,
          highlightId,
          keyAliases,
          formatDataKey,
          formatDataValue,
          // indicates not to override min value in data range with 0
          noZeroMin: name === PROP_TYPES.arcWidth,
        }),
        ...byProducts,
        extruded,
        parameters,
      }
    }, {}),
  })

  const { click, hover, tooltip, highlight, labels } = interactions

  const setLayerData = (data) => {
    if (layer === LAYER_TYPES.MVT) {
      return data?.tileGeom
    }
    if (layer === LAYER_TYPES.select) {
      return { type: 'FeatureCollection', features: data }
    }
    return data
  }

  return data => new Layer({
    id,
    data: setLayerData(data),
    // ====[TODO] logic for below
    // updateTriggers
    mode,
    visualizations,
    interactions,
    dataPropertyAccessor,
    ...defaultProps,
    ...propsWithData({ data }),
    ...geometryProps,
    layerGeometry,
    pickable: Boolean(click || hover || tooltip || highlight || labels ||
      (layer === LAYER_TYPES.select)),
    onEdit: layer !== LAYER_TYPES.select ?
      () => {} :
      ({ updatedData }) => {
        const { setSelectShape } = others
        /**
         * need condition here otherwise we get errors when we draw as updatedData.features is updated
         * only when we finish drawing a point or an entire polygon
         */
        if (updatedData?.features?.length && (!data.length ||
          // these conditions are for calling setSelectShape only when we have new edited / created geometries
          (data.length && !data.includes(updatedData.features[updatedData.features.length - 1])))) {
          setSelectShape(updatedData.features)
        }
      },
    onViewportLoad: layer === LAYER_TYPES.MVT  ? onViewportLoad : null,
    visible: Boolean(data?.length) || Boolean(data?.tileData?.length) ||
      (layer === LAYER_TYPES.select),
    ...others,
  })
}

// ====[TODO] should we define also all geometry accessors for MVT layer?? Current solution is based on our MVT tegola files
/**
 * getObjectMVTData - gets all data attribute keys & values for a hovered MVT object
 * @param { object } param
 * @param { object } param.dataConfig - data configuration object for all map layers
 * @param { object } param.hoverInfo - object of onHover event
 * @returns { object } - object of data { key: value } pairs corresponding to an MVT object
 */
export const getObjectMVTData = ({ dataConfig, hoverInfo }) => {
  const { layer: { props: { dataId, geoKey, geometryAccessor } } } = hoverInfo
  const geo_id = hoverInfo.object.properties?.geo_id
  const tileData = dataConfig?.find(data => data.id === dataId)?.data?.tileData
  return tileData?.find(d => geometryAccessor(d)[geoKey] === geo_id) || {}
}
