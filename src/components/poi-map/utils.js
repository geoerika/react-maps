import Supercluster from 'supercluster'
import * as eqMapLayers from '../../components/layers'

import { getSuperclusterRadius } from '../../shared/utils'
import { SUPERCLUSTER_ZOOM } from '../../constants'


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
 * isClusterZoomLevel - determines if we should use cluster layer for the data in the current viewport
 * @param { object } param
 * @param { string } param.layerVisibleData - layer data displayed in the current viewport
 * @param { string } param.zoom - current map viewport zoom
 * @returns { boolean } - boolean indicating whether we should show clusters on the map
 */
export const isClusterZoomLevel = ({ layerVisibleData, zoom }) => {
  if (layerVisibleData[0].layer.id === 'IconClusterLayer') {
    return Boolean(layerVisibleData?.find(elem => elem?.object?.cluster))
  }
  const visiblePOIs = layerVisibleData.reduce((agg, elem) => {
    return elem.objects ? [...agg, ...elem.objects] : [...agg, elem.object]
  }, [])

  if (visiblePOIs?.length) {
    const getPosition = d => d.geometry.coordinates
    const index = new Supercluster({
      maxZoom: SUPERCLUSTER_ZOOM,
      radius: getSuperclusterRadius({ zoom }),
    })
    index.load(
      visiblePOIs.map(d => ({
        geometry: { coordinates: getPosition(d) },
        properties: d.properties,
      })),
    )
    const z = Math.floor(zoom)
    const clusterData = index.getClusters([-180, -85, 180, 85], z)
  
    return Boolean(clusterData.find(elem => elem?.properties?.cluster))
  }
}
