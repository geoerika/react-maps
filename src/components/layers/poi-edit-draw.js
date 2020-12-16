// ref: https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
import {
  EditableGeoJsonLayer,
  DrawPointMode,
  DrawPolygonMode,
  ModifyMode,
  TransformMode,
} from 'nebula.gl'

import { TYPE_RADIUS } from '../../constants'


const defaultProps = {
  id: 'edit-draw layer',
  pickingRadius: 12,
  _subLayerProps: {
    geojson: {
      lineWidthScale: 1,
      lineWidthMinPixels: 0,
      lineWidthUnits: 'pixels',
      parameters: {
        depthTest: false,
      },
    },
    guides: {
      parameters: {
        depthTest: false,
      },
    },
  },
}

const EDIT_DRAW_MODE = {
  'point-draw': DrawPointMode,
  'polygon-draw': DrawPolygonMode,
  'poi-edit': ModifyMode,
  'poi-radius-edit': TransformMode,
}

/**
 * POIEditDraw - sets the POI editing / drawing layer
 * @param { object } param - props for EditableGeoJsonLayer
 * @param { object } param.mapProps - object of map properties
 * @param { array } param.data - data array
 * @param { function } param.updatePOI - function to update POI during editing
 * @param { string } param.mode - editing / drawing mode
 * @param { number } param.POIType - POI type
 * @param { array } param.selectedFeatureIndexes - array of selected feature indexes
 * @return { instanceOf EditableGeoJsonLayer}
 */
const POIEditDraw = ({ mapProps, data, updatePOI, mode, POIType, selectedFeatureIndexes }) => {
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
      ...defaultProps._subLayerProps,
      geojson: {
        ...defaultProps._subLayerProps.geojson,
        getFillColor: () => mapProps.fillColour,
        getLineColor: () => mapProps.lineColour,
        getLineWidth: () => mapProps.lineWidth,
        opacity: mapProps.opacity,
        getRadius: d => {
          if (POIType === TYPE_RADIUS.code) {
            return d.properties.radius
          }
          return null
        },
      },
    },
  })
}

export default POIEditDraw
