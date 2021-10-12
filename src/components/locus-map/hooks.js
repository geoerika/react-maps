import { useMemo } from 'react'

import {
  setLegendConfigs,
  getArrayGradientFillColors,
  getStrFillColor,
  setLegendOpacity,
} from '../../shared/utils'
import { LAYER_CONFIGURATIONS, PROP_CONFIGURATIONS } from './constants'

/**
 * useLegends - React Hook to set legend config objects for all map layers
 * @param { object } param
 * @param { object } param.dataConfig - data configuration object for all map layers
 * @param { object } param.layerConfig - layer configuration object for map
 * @returns { array } - array of legend config objects for all map layers
 */
export const useLegends = ({ dataConfig, layerConfig }) => {
  const dataMap = dataConfig.reduce((map, data) => {
    map[data.id] = data
    return map
  }, {})
  const mapLegends = useMemo(() => {
    let legends = []
    layerConfig.forEach(layer => {
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
        const symbolLineColor = getStrFillColor({
          fillColor: visualizations?.lineColor || PROP_CONFIGURATIONS.lineColor.defaultValue,
          opacity: setLegendOpacity({ opacity }),
        })
        /**
         * We convert an array of array-format colors, into an array of rgba string format colours so we
         * can use them in the Legend Gradient component
         *
         * There is visually a difference between the legend opacity for color gradient and map opacity,
         * we need to adjust opacity for symbols in the legend to have a closer match
         */
        const fillColors = visualizations?.fill?.valueOptions ?
          getArrayGradientFillColors({
            fillColors: visualizations.fill.valueOptions,
            opacity: setLegendOpacity({ opacity }),
          }) : ''
        const objColor = Array.isArray(visualizations?.fill?.value) ?
          getStrFillColor({ fillColor: visualizations.fill.value, opacity: setLegendOpacity({ opacity }) }) :
          ''

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
        })

        legends = [...legends, ...layerLegends]
      }
    })
    return legends
  }, [layerConfig, dataMap])
  return mapLegends
}
