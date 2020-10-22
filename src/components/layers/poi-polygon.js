// ref: https://deck.gl/docs/api-reference/layers/polygon-layer
import {PolygonLayer} from 'deck.gl';


const defaultProps = {
  id: 'polygon-layer',
  pickable: true,
  stroked: true,
  filled: true,
  wireframe: true,
  lineWidthMinPixels: 1,
  getPolygon: d => d.geometry.coordinates,
  opacity: 0.5,
  getFillColor: [255, 0, 0],
  getLineColor: [80, 80, 80],
  getLineWidth: 1
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
