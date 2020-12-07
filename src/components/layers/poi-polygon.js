// ref: https://deck.gl/docs/api-reference/layers/polygon-layer
import { PolygonLayer } from 'deck.gl'
import {
  POI_FILL_COLOUR,
  POI_LINE_COLOUR,
  POI_LINE_WIDTH,
  POI_OPACITY,
} from '../../constants'



const defaultProps = {
  id: 'polygon-layer',
  pickable: true,
  stroked: true,
  filled: true,
  wireframe: true,
  lineWidthMinPixels: 1,
  getPolygon: d => d.geometry.coordinates,
  opacity: POI_OPACITY,
  getFillColor: POI_FILL_COLOUR,
  getLineColor: POI_LINE_COLOUR,
  getLineWidth: POI_LINE_WIDTH,
}

/**
 * POIPolygon - sets the POI polygon layer
 * @param { object } props - props for PolygonLayer
 * @returns { instanceOf PolygonLayer } 
 */
const POIPolygon = (props) => 
  new PolygonLayer({
    ...defaultProps,
    ...props,
  });

export default POIPolygon
