import * as eqMapLayers from '../../components/layers/index'

/**
 * processLayers - choses a layer based on type parameter
 * @param { array } layerArray - array of layers to show on map
 * @param { object } props - layers' props
 * @returns { instanceOf } Deck.gl layer
 */
export const processLayers = (layerArray, props) => {
  return layerArray.map(layer => layer === 'cluster' 
    ? new eqMapLayers[layer](props)
    : eqMapLayers[layer](props))
}