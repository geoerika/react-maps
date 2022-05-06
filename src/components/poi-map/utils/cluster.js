import Supercluster from 'supercluster'

import { SUPERCLUSTER_ZOOM, CLUSTER_SIZE_SCALE } from '../../../constants'


/**
 * isClusterZoomLevel - determines if we should use cluster layer for the data in the current viewport
 * @param { object } param
 * @param { string } param.layerVisibleData - layer data displayed in the current viewport
 * @param { string } param.viewportBBOX - bounding box coordinates for the current viewport
 * @param { string } param.zoom - current map viewport zoom
 * @returns { boolean } - boolean indicating whether we should show clusters on the map
 */
export const isClusterZoomLevel = ({ layerVisibleData, viewportBBOX, zoom }) => {
  const visiblePOIs = layerVisibleData.reduce((agg, elem) => {
    return elem.objects ? [...agg, ...elem.objects] : [...agg, elem.object]
  }, [])

  if (visiblePOIs.length) {
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
    const clusterData = index.getClusters(viewportBBOX, z)
  
    return Boolean(clusterData.find(elem => elem?.properties?.cluster))
  }
}

/**
 * getSuperclusterRadius - determines cluster radius
 * @param { object } param
 * @param { number } param.zoom - viewstate zoom
 * @param { number } param.sizeScale - scale for cluster radius size
 * @returns { number  } - cluster radius in pixels
 */
export const getSuperclusterRadius = ({ zoom, sizeScale = CLUSTER_SIZE_SCALE }) =>
  zoom > 15 ?
    sizeScale / 2 :
    sizeScale
