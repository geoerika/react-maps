import { useMemo } from 'react'

import {
  setLegendConfigs,
  getArrayGradientFillColors,
  arrayToRGBAStrColor,
  strToArrayColor,
  setLegendOpacity,
  getSchemeColorValues,
} from '../../shared/utils'
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
  const mapLegends = useMemo(() => layerConfig.reduce((layerList, layer) => {
    const { visualizations, opacity = 1, metricAliases, formatPropertyLabel, formatData } = layer
    const showLegend = layer.legend?.showLegend
    const formatLegendTitle = layer.legend?.formatLegendTitle
    if (showLegend) {
      let data = dataMap[layer.dataId]?.data || {}
      data = data?.tileData ? data.tileData : data
      const dataPropertyAccessor = layer.dataPropertyAccessor ||
        LAYER_CONFIGURATIONS[layer.layer]?.dataPropertyAccessor || (d => d)
      const fillBasedOn = visualizations?.fill?.value?.field
      const radiusBasedOn = visualizations?.radius?.value?.field
      const elevationBasedOn = visualizations?.elevation?.value?.field

      const { schemeColor } = layer
      // generate colours for stroke and fill from the base schemeColour
      const {
        newLineColor,
        newColorValue,
        newColorValueOptions,
      } = schemeColor ? getSchemeColorValues(schemeColor) : {}

      // set symbolLineColor param
      let symbolLineColor = arrayToRGBAStrColor({
        color: PROP_CONFIGURATIONS.lineColor.defaultValue,
        opacity: setLegendOpacity({ opacity }),
      })
      if (visualizations?.lineColor?.value) {
        const visLineColor = visualizations.lineColor.value.customValue ?
          visualizations.lineColor.value.customValue :
          visualizations.lineColor.value
        symbolLineColor = arrayToRGBAStrColor({
          color: Array.isArray(visLineColor) ?
            visLineColor :
            strToArrayColor({ strColor: visLineColor }),
          opacity: setLegendOpacity({ opacity }),
        })
      }
      if (newLineColor) {
        symbolLineColor = arrayToRGBAStrColor({
          color: newLineColor,
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
      let fillColors = null
      if (visualizations?.fill?.valueOptions) {
        fillColors = getArrayGradientFillColors({
          fillColors: visualizations.fill.valueOptions,
          opacity: setLegendOpacity({ opacity }),
        })
      }
      if (newColorValueOptions) {
        fillColors = getArrayGradientFillColors({
          fillColors: newColorValueOptions,
          opacity: setLegendOpacity({ opacity }),
        })
      }

      // colour for map symbols when fill is not based on data
      let objColor = arrayToRGBAStrColor({
        color: PROP_CONFIGURATIONS.fill.defaultValue,
        opacity: setLegendOpacity({ opacity }),
      })
      const colorVal = visualizations?.fill?.value
      if (colorVal && !colorVal.field) {
        objColor = arrayToRGBAStrColor({
          color: Array.isArray(colorVal) ?
            colorVal :
            strToArrayColor({ strColor: colorVal }),
          opacity: setLegendOpacity({ opacity }),
        })
      }
      if (newColorValue) {
        objColor = arrayToRGBAStrColor({
          color: newColorValue,
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
        metricAliases,
        formatLegendTitle,
        formatPropertyLabel,
        formatData,
        symbolLineColor,
        objColor,
        legendSize,
      })
      layerList = [...layerList, ...layerLegends]
    }
    return layerList
  }, []), [layerConfig, dataMap, legendSize])
  return mapLegends
}
