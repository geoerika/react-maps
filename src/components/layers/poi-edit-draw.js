// ref: https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
import {
  EditableGeoJsonLayer,
  DrawPointMode,
  DrawPolygonMode,
  ModifyMode,
  TransformMode,
} from 'nebula.gl'

import {
  TYPE_RADIUS,
  POI_FILL_COLOUR,
  POI_LINE_COLOUR,
  POI_LINE_WIDTH,
  POI_OPACITY,
} from '../../constants'


const defaultProps = {
  id: 'edit-draw layer',
  pickingRadius: 12,
  _subLayerProps: {
    geojson: {
      getFillColor: () => POI_FILL_COLOUR,
      getLineColor: () => POI_LINE_COLOUR,
      getLineWidth: POI_LINE_WIDTH,
      opacity: POI_OPACITY,
      lineWidthScale: 1,
      lineWidthMinPixels: 0,
      lineWidthUnits: 'pixels',
    }
  },
}

const EDIT_DRAW_MODE = {
  'point-draw': DrawPointMode,
  'polygon-draw': DrawPolygonMode,
  'poi-edit': ModifyMode,
  'poi-radius-edit': TransformMode,
}

// POIEditDraw - sets the POI editing / drawing layer
const POIEditDraw = ({ data, updatePOI, mode, POIType, selectedFeatureIndexes }) => {
  const prevCoordinates = data[0]?.prevCoordinates
  const editDrawMode = mode === 'edit' ?
    (POIType === TYPE_RADIUS.code ? 'poi-radius-edit' : 'poi-edit') :
    mode

  return new EditableGeoJsonLayer({
    ...defaultProps,
    data: {
      type: 'FeatureCollection',
      features: data,
    },
    mode: EDIT_DRAW_MODE[editDrawMode],
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
    _subLayerProps: {
      geojson: {
        ...defaultProps._subLayerProps.geojson,
        getRadius: d => {
          if (POIType === TYPE_RADIUS.code) {
            return d.properties.radius
          }
        },
      }
    }
  })
}

export default POIEditDraw
