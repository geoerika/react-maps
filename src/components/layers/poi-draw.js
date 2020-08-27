// ref: https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
import { EditableGeoJsonLayer, DrawPointMode, DrawPolygonMode } from 'nebula.gl'

const selectedFeatureIndexes = []

const POIDraw = ({ data, setData, mode}) => {

  const DRAW_MODE = {
    'point-draw': DrawPointMode,
    'polygon-draw': DrawPolygonMode
  }

  return new EditableGeoJsonLayer({
    id: 'draw layer',
    data: {
      type: 'FeatureCollection',
      features: data
    },
    mode: DRAW_MODE[mode],
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => setData(updatedData.features)
  })
}

export default POIDraw
