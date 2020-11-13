// ref: https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
import {
  EditableGeoJsonLayer,
  DrawPointMode,
  DrawPolygonMode,
  ModifyMode,
  TransformMode,
} from 'nebula.gl'


const defaultProps = {
  id: 'edit-draw layer',
  pickingRadius: 12,
  _subLayerProps: {
    geojson: {
      getFillColor: () => [225, 0, 0],
      getLineColor: () => [0, 0, 0],
      opacity: 0.2,
    }
  },
}

const EDIT_DRAW_MODE = {
  'point-draw': DrawPointMode,
  'polygon-draw': DrawPolygonMode,
  'poi-edit': ModifyMode,
  'poi-point-radius-edit': TransformMode,
}

// POIEditDraw - sets the POI editing / drawing layer
const POIEditDraw = ({ data, updatePOI, mode, selectedFeatureIndexes }) => {
  const prevCoordinates = data[0]?.prevCoordinates
  return new EditableGeoJsonLayer({
    ...defaultProps,
    data: {
      type: 'FeatureCollection',
      features: data,
    },
    mode: EDIT_DRAW_MODE[mode],
    selectedFeatureIndexes,
    onEdit: ({ updatedData, editType }) => {
      /**
       * need condition here otherwise we get errors when we draw as updatedData.features is updated
       * only when we finish drawing a point or an entire polygon
       */
      if (updatedData?.features.length) {
        return updatePOI(updatedData.features, editType, prevCoordinates)
      }
    },
  })
}

export default POIEditDraw
