import { setFinalLayerDataProperty } from '../../shared/utils'
import { PROP_CONFIGURATIONS, LAYER_CONFIGURATIONS } from './constants'


export const parseDeckGLLayerFromConfig = ({
  id,
  layer,
  geometry,
  visualizations,
  // interactions,
  ...other
}) => {
  const {
    dataPropertyAccessor = d => d,
    geometry: layerGeom,
    deckGLClass: Layer,
    defaultProps,
    visualizations: layerVisualizations,
  } = LAYER_CONFIGURATIONS[layer]

  // ====[NOTE] if a layer requires explicit geometry (all except GeoJson?)
  // =========] pass its configured values (references to data fields) to final propFn
  const geometryProps = layerGeom.propName ?
    { [layerGeom.propName]: layerGeom.propFn({ ...geometry }) } : {}
  // ====[TODO] correct fallback logic for the above. Should throw an error or prompt someone to choose

  // ====[TODO] calculate field extents in advance, so every configurable aspect doesn't need to
  const propsWithData = ({ data, highlightId }) => ({
    // ====[TODO] trim invalid visualization values for a given layer
    // =========] and provide the defaults from PROP_CONFIG
    ...layerVisualizations.reduce((agg, name) => {
      const config = visualizations[name] || {}
      const { deckGLName, defaultValue, byProducts = {} } = PROP_CONFIGURATIONS[name]
      return {
        ...agg,
        [deckGLName]: setFinalLayerDataProperty({
          ...config,
          data,
          defaultValue,
          dataPropertyAccessor,
          highlightId,
        }),
        ...byProducts,
      }
    }, {}),
  })

  return data => new Layer({
    id,
    data,
    // ====[TODO] logic for below
    // pickable
    // updateTriggers
    ...defaultProps,
    ...other,
    ...propsWithData({ data }),
    ...geometryProps,
  })
}
