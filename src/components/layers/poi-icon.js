// https://deck.gl/docs/api-reference/layers/icon-layer

import { IconLayer } from 'deck.gl'
import poiIcon from '../icons/poi-location.png'

// icon mapping for poi icon layer
const POI_ICON_MAPPING = { marker: { x: 0, y: 0, width: 1024, height: 1024 }}

const defaultProps = {
  iconAtlas: poiIcon,
  iconMapping: POI_ICON_MAPPING,
  getIcon: d => 'marker',
  sizeScale: 5,
  getPosition: d => d.geometry.coordinates,
  getSize: 5,
  getColor: [255, 0, 0],
}

/**
 * setPOIIcon - sets the poi icon layer
 * @param { object } props - props object for passing data and other attributes to POIIcon
 * @returns { instanceOf IconLayer} 
 */
const POIIcon = (props) => {
  return  new IconLayer({
    ...props,
    ...defaultProps
  })}

export default POIIcon
