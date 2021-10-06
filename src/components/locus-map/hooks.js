import { useMemo } from 'react'

import { getDataRange, getArrayGradientFillColors, setLegendOpacity } from '../../shared/utils'
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
    const legends = []
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
        const fillColors = getArrayGradientFillColors({
          fillColors: visualizations?.fill?.valueOptions,
          opacity: setLegendOpacity({ opacity }),
        })

        const legendProps = {
          metricAliases,
          formatLegendTitle,
          formatPropertyLabel,
          formatData,
          symbolLineColor,
        }
  
        if (fillBasedOn && data?.length) {
          // TODO support quantile/quantize
          // i.e. different lengths of fillColors[]
          const dataRange = getDataRange({ data, dataKey: fillBasedOn, dataPropertyAccessor })
          legends.push({
            minColor: fillColors[0],
            maxColor: fillColors[1],
            type: 'gradient',
            min: dataRange[0],
            max: dataRange[1],
            label: fillBasedOn,
            ...legendProps,
          })
        }
    
        if (elevationBasedOn && data?.length) {
          const dataRange = getDataRange({ data, dataKey: elevationBasedOn, dataPropertyAccessor })
          legends.push({
            type: 'elevation',
            minColor: fillColors[0],
            maxColor: fillColors[1],
            min: dataRange[0],
            max: dataRange[1],
            label: elevationBasedOn,
            ...legendProps,
          })
        }
    
        if (radiusBasedOn && data?.length) {
          const dataRange = getDataRange({ data, dataKey: radiusBasedOn, dataPropertyAccessor })
          legends.push({
            minColor: fillColors[0],
            maxColor: fillColors[1],
            type: 'size',
            dots: 5,
            size: 5,
            zeroRadiusSize: 20,
            min: dataRange[0],
            max: dataRange[1],
            label: radiusBasedOn,
            ...legendProps,
          })
        }
      }
    })
    return legends
  }, [dataConfig, layerConfig])
  return mapLegends
}
