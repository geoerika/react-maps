import { IconLayer } from 'deck.gl'
import poiIcon from '../icons/poi-location.png'

// icon mapping for poi icon layer
const POI_ICON_MAPPING = { marker: { x: 0, y: 0, width: 1024, height: 1024 }}

const defaultProps = {
  iconAtlas: poiIcon,
  iconMapping: POI_ICON_MAPPING,
  sizeScale: 5,
  getPosition: d => d.geometry.coordinates,
  getSize: d => 5,
  getColor: d => [255, 0, 0],
}

/**
 * setPOIIcon - sets the poi icon layer
 * @param { array } data - poi data array
 * @param { string } iconAtlas- png image containing the poi icon symbol
 * @param { object } iconMapping - object mapping the poi icon symbol location and size in iconAtlas
 * @param { number } sizeScale - icon size multiplier
 * @param { function } getPosition - function to retrieve position of each poi from data array
 * @param { function } getSize - access function to set the size of each poi
 * @param { function } getColor - access function to set colour for poi icons
 * @returns { instanceOf IconLayer} 
 */
export const setPOIIcon = (
  data,
  iconAtlas,
  iconMapping,
  sizeScale,
  getPosition,
  getSize,
  getColor
) =>
  new IconLayer({
    data,
    iconAtlas,
    iconMapping,
    getIcon: d => 'marker',
    sizeScale,
    getPosition,
    getSize,
    getColor,
    ...defaultProps
  })
