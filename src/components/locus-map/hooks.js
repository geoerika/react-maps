import { useMemo } from 'react'

import { setLegendConfigs, getArrayGradientFillColors, setLegendOpacity } from '../../shared/utils'
import { PROP_CONFIGURATIONS } from './constants'

/**
 * useLegends - React Hook to set legend config objects for all map layers
 * @param { object } param
 * @param { object } param.dataConfig - data configuration object for all map layers
 * @param { object } param.layerConfig - layer configuration object for map
 * @returns { array } - array of legend config objects for all map layers
 */
export const useLegends = ({ dataConfig, layerConfig }) => {
  const mapLegends = useMemo(() => {
    let legends = []
    layerConfig.forEach(layer => {
      const { visualizations, opacity = 1, metricAliases, formatPropertyLabel, formatData } = layer
      const showLegend = layer.legend?.showLegend
      const formatLegendTitle = layer.legend?.formatLegendTitle
      if (showLegend) {
        let data = dataConfig.find(data => data.id === layer.dataId)?.data
        data = data.tileData ? data.tileData : data
        const dataPropertyAccessor = layer.dataPropertyAccessor || (d => d)
        const fillBasedOn = visualizations?.fill?.value?.field
        const radiusBasedOn = visualizations?.radius?.value?.field
        const elevationBasedOn = visualizations?.elevation?.value?.field
        const symbolLineColor = visualizations?.lineColor || PROP_CONFIGURATIONS.lineColor.defaultValue
        /**
         * We convert an array of string format colors, into an array of rgba string format colours so we
         * can use them in the Legend Gradient component
         *
         * There is visually a difference between the legend opacity for color gradient and map opacity,
         * we need to adjust opacity for symbols in the legend to have a closer match
         */
        const fillColors = visualizations?.fill?.valueOptions ?
          getArrayGradientFillColors({
            fillColors: visualizations?.fill?.valueOptions,
            opacity: setLegendOpacity({ opacity }),
          }) : ''

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
        })

        legends = [...legends, ...layerLegends]
      }
    })
    return legends
  }, [dataConfig, layerConfig])
  return mapLegends
}
