import { useMemo } from 'react'

import { getSchemeColorValues } from './utils/scheme-color'
import { setLegendConfigs, setLegendOpacity } from '../../utils/legend'
import {
  getArrayGradientFillColors,
  arrayToRGBAStrColor,
  strToArrayColor,
  validColor,
} from '../../utils/color'
import { LAYER_CONFIGURATIONS, PROP_CONFIGURATIONS } from './constants'


/**
 * useLegends - React Hook to set legend config objects for all map layers
 * @param { object } param
 * @param { object } param.dataConfig - data configuration object for all map layers
 * @param { object } param.layerConfig - layer configuration object for map
 * @returns { array } - array of legend config objects for all map layers
 */
export const useLegends = ({ dataConfig, layerConfig, legendSize }) => {
  const dataMap = dataConfig.reduce((map, data) => {
    map[data.id] = data
    return map
  }, {})
  const mapLegends = useMemo(() => layerConfig.reduce((legendList, layer) => {
    const {
      visualizations,
      opacity = 1,
      keyAliases,
      formatDataKey,
      formatDataValue,
      isTargetLayer,
      legend,
      visible = true,
    } = layer

    const showLegend = legend?.showLegend || true
    const layerTitle = legend?.layerTitle || ''
    const formatLegendTitle = layer.legend?.formatLegendTitle
    if (showLegend && visible) {
      let data = dataMap[layer.dataId]?.data || {}
      data = data?.tileData ? data.tileData : data
      const dataPropertyAccessor = layer.dataPropertyAccessor ||
        LAYER_CONFIGURATIONS[layer.layer]?.dataPropertyAccessor || (d => d)
      const fillBasedOn = visualizations?.fill?.value?.field
      const radiusBasedOn = visualizations?.radius?.value?.field || visualizations?.pointRadius?.value?.field
      const elevationBasedOn = visualizations?.elevation?.value?.field
      const arcWidthBasedOn = visualizations?.arcWidth?.value?.field

      const { schemeColor } = layer
      // generate colours for stroke and fill from the base schemeColour
      const {
        newLineColor,
        newColorValue,
        newTargetColor,
        newTargetLineColor,
        newColorValueOptions,
        newTargetColorValueOptions,
      } = validColor(schemeColor) ? getSchemeColorValues(schemeColor) : {}

      // set symbolLineColor param
      let symbolLineColor = arrayToRGBAStrColor({
        color: PROP_CONFIGURATIONS.lineColor.defaultValue,
        opacity: setLegendOpacity({ opacity }),
      })
      if (visualizations?.lineColor?.value) {
        const visLineColor = validColor(visualizations.lineColor.value.customValue) ?
          visualizations.lineColor.value.customValue :
          visualizations.lineColor.value
        // check when we send lineColor with a value.field but not customValue for schemeColor & MVT layer
        if (validColor(visLineColor))  {
          symbolLineColor = arrayToRGBAStrColor({
            color: Array.isArray(visLineColor) ?
              visLineColor :
              strToArrayColor({ strColor: visLineColor }),
            opacity: setLegendOpacity({ opacity }),
          })
        }
      }
      if (newLineColor) {
        symbolLineColor = arrayToRGBAStrColor({
          color: isTargetLayer ? newTargetLineColor : newLineColor,
          opacity: setLegendOpacity({ opacity }),
        })
      }

      /**
       * We convert an array of array-format colors, into an array of rgba string format colours so we
       * can use them in the Legend Gradient component
       *
       * There is visually a difference between the legend opacity for color gradient and map opacity,
       * we need to adjust opacity for symbols in the legend to have a closer match
       */
      const [colorMin, colorMax] = PROP_CONFIGURATIONS.fill.defaultValue.valueOptions || []
      let fillColors = getArrayGradientFillColors({
        fillColors: [
          arrayToRGBAStrColor({ color: colorMin }),
          arrayToRGBAStrColor({ color: colorMax }),
        ],
        opacity: setLegendOpacity({ opacity }),
      })
      if (visualizations?.fill?.valueOptions?.every(col => validColor(col))) {
        fillColors = getArrayGradientFillColors({
          fillColors: visualizations.fill.valueOptions,
          opacity: setLegendOpacity({ opacity }),
        })
      }
      if (newColorValueOptions) {
        fillColors = getArrayGradientFillColors({
          fillColors: isTargetLayer ? newTargetColorValueOptions : newColorValueOptions,
          opacity: setLegendOpacity({ opacity }),
        })
      }
      if (visualizations?.arcWidth) {
        if (newColorValueOptions) {
          fillColors = getArrayGradientFillColors({
            fillColors: [newColorValue, newTargetColor],
            opacity: setLegendOpacity({ opacity }),
          })
        } else if (validColor(visualizations?.sourceArcColor?.value) &&
          validColor(visualizations?.targetArcColor?.value)) {
          fillColors = getArrayGradientFillColors({
            fillColors: [visualizations?.sourceArcColor?.value, visualizations?.targetArcColor?.value],
            opacity: setLegendOpacity({ opacity }),
          })
        }
      }

      // colour for map symbols when fill is not based on data
      let objColor = arrayToRGBAStrColor({
        color: PROP_CONFIGURATIONS.fill.defaultValue,
        opacity: setLegendOpacity({ opacity }),
      })
      const colorVal = visualizations?.fill?.value
      if (validColor(colorVal)) {
        objColor = arrayToRGBAStrColor({
          color: Array.isArray(colorVal) ?
            colorVal :
            strToArrayColor({ strColor: colorVal }),
          opacity: setLegendOpacity({ opacity }),
        })
      }
      if (newColorValue) {
        objColor = arrayToRGBAStrColor({
          color: isTargetLayer ? newTargetColor : newColorValue,
          opacity: setLegendOpacity({ opacity }),
        })
      }

      const layerLegends = setLegendConfigs({
        data,
        dataPropertyAccessor,
        elevationBasedOn,
        fillBasedOn,
        fillColors,
        radiusBasedOn,
        keyAliases,
        arcWidthBasedOn,
        formatLegendTitle,
        formatDataKey,
        formatDataValue,
        symbolLineColor,
        objColor,
        legendSize,
        layerTitle: layerTitle,
      })
      legendList = [...legendList, ...layerLegends]
    }
    return legendList
  }, []), [layerConfig, dataMap, legendSize])
  return mapLegends
}
