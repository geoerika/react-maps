import {PolygonLayer} from 'deck.gl';

const defaultProps = {
  id: 'polygon-layer',
  pickable: true,
  stroked: true,
  filled: true,
  wireframe: true,
  lineWidthMinPixels: 1,
  getPolygon: d => JSON.parse(d.properties.polygon_json.split(':')[2].split('}')[0]),
  opacity: 0.5,
  getFillColor: [255, 0, 0],
  getLineColor: [80, 80, 80],
  getLineWidth: 1
}

const POIPolygon = (props) => 
  new PolygonLayer({
    ...props,
    ...defaultProps
  });

export default POIPolygon
