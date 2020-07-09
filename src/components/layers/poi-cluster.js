/**
 * ref: https://github.com/visgl/deck.gl/blob/master/examples/website/icon/icon-cluster-layer.js
 *      https://github.com/EQWorks/flaat-dash/blob/master/src/components/layers/cluster-layer.js
 */

import {CompositeLayer} from 'deck.gl'
import {IconLayer} from 'deck.gl'
import Supercluster from 'supercluster'

// import { isSameLocation } from '../small-business-helper/helper'

// function getIconName(size) {
//   if (size === 0) {
//     return '';
//   }
//   if (size < 10) {
//     return `marker-${size}`;
//   }
//   if (size < 100) {
//     return `marker-${Math.floor(size / 10)}0`;
//   }
//   return 'marker-100';
// }

const getIconSize = (size) => {
  return Math.min(100, size) / 100 + 1;
}


const getIconName = (size) => {
  return `marker-${size < 10 ? size : Math.min(Math.floor(size / 10) * 10, 100)}`
}

// const getSize = highlight => d => {
//   const iconSize = d.properties.cluster 
//     ? ((Math.min(100, d.properties.point_count) / 100) + 1) 
//     : 0.8
//   return ((d.properties.id || d.properties.cluster_id) === highlight) ? iconSize * 1.3 : iconSize
// }

// const getIcon = (highlight, index) => d => {
//   // if d.type exists, it's a cluster, fetch all businesses under that cluster.
//   if (d.type){
//     // array of business inside a cluster
//     // https://www.npmjs.com/package/supercluster#getleavesclusterid-limit--10-offset--0
//     const clusteredBusiness = index.getLeaves(d.id, Infinity, 0).map(bus => bus.properties)
//     // if they are not in the same location get the right name
//     return isSameLocation(clusteredBusiness) ? 'marker' :  getIconName(d.properties.point_count)
//   } else {
//     return d.properties.egift_url
//       ? (d.properties.id === highlight ? 'egift-focus' : 'egift')
//       : (d.properties.id === highlight ? 'no-egift-focus' : 'no-egift')
//   }
// }

export default class IconClusterLayer extends CompositeLayer {
  shouldUpdateState({changeFlags}) {
    return changeFlags.somethingChanged
  }

  updateState({props, oldProps, changeFlags}) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale

    if (rebuildIndex) {
      const index = new Supercluster({
        maxZoom: props.superclusterZoom,
        radius: props.getSuperclusterRadius(this.context.viewport.zoom, props.sizeScale)
      })
      index.load(
        props.data.map(d => ({
          geometry: {coordinates: props.getPosition(d)},
          properties: d
        }))
      )
      this.setState({index})
    }

    const z = Math.floor(this.context.viewport.zoom)
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      })
    }
  }

  getPickingInfo({info, mode}) {
    const pickedObject = info.object && info.object.properties
    if (pickedObject) {
      if (pickedObject.cluster && mode !== 'hover') {
        info.objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map(f => f.properties)
      }
      info.object = pickedObject
    }
    return info
  }

  renderLayers() {
    const { data } = this.state
    const {
      iconAtlas,
      iconMapping,
      sizeScale,
      // highlight
    } = this.props

    return new IconLayer(
      this.getSubLayerProps({
        id: 'icon',
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: d => d.geometry.coordinates,
        getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
        getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
      }),
    )
  }
}