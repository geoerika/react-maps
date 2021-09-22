// ref: https://deck.gl/docs/api-reference/layers/polygon-layer
import { PolygonLayer } from '@deck.gl/layers'


const defaultProps = {
  id: 'polygon-layer',
  stroked: true,
  filled: true,
  wireframe: true,
  lineWidthMinPixels: 1,
  getPolygon: d => d.geometry.coordinates,
  visible: false,
}

/**
 * POIPolygon - sets the POI polygon layer
 * @param { object } param - props for PolygonLayer
 * @param { object } param.mapProps - object of map properties
 * @param { array } param.data - data array
 * @returns { instanceOf PolygonLayer } 
 */
const POIPolygon = ({ mapProps, data, visible, ...props }) =>
  new PolygonLayer({
    data,
    ...defaultProps,
    getFillColor: () => mapProps.polygonFillColour,
    getLineColor: () => mapProps.lineColour,
    getLineWidth: () => mapProps.lineWidth,
    opacity: mapProps.opacity,
    visible,
    pickable: visible,
    ...props,
  })
export default POIPolygon
