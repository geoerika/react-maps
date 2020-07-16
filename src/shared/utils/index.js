import IconClusterLayer from '../../components/layers/poi-cluster'
import { setPOIIcon } from '../../components/layers/poi-icon'
import { setGeoJsonLayer } from '../../components/layers/poi-geojson'

// type of Deck.gl layers to use 
const LAYERS_METHODS = {
  'icon': (data) => setPOIIcon(data),
  'cluster': (data, onClick) => new IconClusterLayer({
    onClick,
    data,
    getSuperclusterRadius: (viewportZoom, sizeScale) => 
      viewportZoom > 15 ? sizeScale / 3 : sizeScale
  }),
  'geojson' : (data) => setGeoJsonLayer(data)
}

/**
 * processLayers - choses a layer based on type parameter
 * @param { string } type - type of layer, ie: 'icon', 'cluster'
 * @param { array} data - poi data array
 * @param { function } onClick - click method to use
 * @returns { instanceOf } Deck.gl layer
 */
export const processLayers = (layerArray, data, onClick) => {
  return layerArray.map(layerType => LAYERS_METHODS[layerType](data, onClick))
}

// onClick methods to use 
const ON_CLICK_METHODS = {
  'zoomOnClusterClick' :  (params, setActivePOI) => {
    const { object, layer, coordinate } = params
    const [ longitude, latitude ] = coordinate
    if (object.cluster) {
      setActivePOI({ longitude, latitude, zoom: layer.state.z + 2})
    }
  }
}

/**
 * processOnClick - choses an onClick method based on onClickType
 * @param { string } onClickType - type of onClick method, ie: 'zoomOnClusterClick'
 * @param { array} params - 
 * @param { function } setActivePOI - sets activePOI
 * @returns { instanceOf } Deck.gl layer
 */
export const processOnClick = (onClickType, params, setActivePOI) =>
  ON_CLICK_METHODS[onClickType](params, setActivePOI)