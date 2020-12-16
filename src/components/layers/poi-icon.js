// https://deck.gl/docs/api-reference/layers/icon-layer

import { IconLayer } from 'deck.gl'
import POIIconMarker from '../icons/poi-location.png'

// icon mapping for poi icon layer
const POI_ICON_MAPPING = { marker: { x: 0, y: 0, width: 1024, height: 1024, anchorY: 1024 } }

const defaultProps = {
  iconAtlas: POIIconMarker,
  iconMapping: POI_ICON_MAPPING,
  billboard: true,
  getIcon: () => 'marker',
  getPosition: d => d.geometry.coordinates,
  getSize: 4,
  pickable: true,
}

/**
 * setPOIIcon - sets the POI icon layer
 * @param { object } props - props object for passing data and other attributes to POIIcon
 * @returns { instanceOf IconLayer}
 */
const POIIcon = (props) =>
  new IconLayer({
    ...defaultProps,
    sizeScale: props.data.length === 1 ? 15 : 5,
    ...props,
  })

export default POIIcon
