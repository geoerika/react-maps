import * as eqMapLayers from '../../components/layers'


/**
 * processLayers - returns layers used by POIMap
 * @param { object } param
 * @param { array } param.mapLayers - array of layers to show on map
 * @param { array } param.layerPool - array of all layers used by map in general
 * @param { object } param.props - layers' props
 * @returns { array } - array of Deck.gl and Nebula.gl layers used by POIMap
 */
export const processLayers = ({ mapLayers, layerPool, props }) =>
  layerPool.map(layer =>
    mapLayers.includes(layer) ?
      setLayer({ layer, props, visible: true }) :
      setLayer({ layer, props, visible: false }),
  )

/**
* setLayer - sets a map layer
* @param { object } param
* @param { string } param.layer - name of a layer found in src/components/layers/index.js
* @param { object } param.props - object of layer props
* @param { boolean } param.visible - boolean to be used to set a certain layer visible or not on the map
* @returns { instanceOf } - Deck.gl or Nebula.gl layer
*/
const setLayer = ({ layer, props, visible }) =>
  layer === 'POICluster' ?
    new eqMapLayers[layer]({ ...props, visible }) :
    eqMapLayers[layer]({ ...props, visible })


/**
* clusterZoomLevel - determines if we still have clusters in the data displayed in current viewport
* @param { object } param
* @param { string } param.clusterLayerVisibleData - cluster layer data displayed in the current viewport
* @returns { boolean } - boolean indicating if we see or not clusters in the viewport
*/
export const clusterZoomLevel = ({ layerVisibleData }) => {
  return Boolean(layerVisibleData.find(elem => elem?.object?.cluster))
}
