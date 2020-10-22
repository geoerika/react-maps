// ref: https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
import { EditableGeoJsonLayer, DrawPointMode, DrawPolygonMode, ModifyMode } from 'nebula.gl'


const defaultProps = {
  id: 'draw layer',
  pickingRadius: 12,
  _subLayerProps: {
    geojson: {
      getFillColor: () => [225, 0, 0],
      getLineColor: () => [0, 0, 0],
      opacity: 0.2,
    }
  },
}

const DRAW_MODE = {
  'point-draw': DrawPointMode,
  'polygon-draw': DrawPolygonMode,
  'poi-edit': ModifyMode,
}

// POIEditDraw - sets the POI editing / drawing layer
const POIEditDraw = ({ data, updatePOI, mode, selectedFeatureIndexes }) =>
  new EditableGeoJsonLayer({
    ...defaultProps,
    data: {
      type: 'FeatureCollection',
      features: data
    },
    mode: DRAW_MODE[mode],
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => updatePOI(updatedData.features),
  })

export default POIEditDraw
