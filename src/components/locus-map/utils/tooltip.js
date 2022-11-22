/**
 * getTooltipParams - gets all props related to tooltip component
 * @param { object } param
 * @param { object } param.hoverInfo - object of hovered element on the map
 * @returns { object } - object of tooltip component keys and values
 */
export const getTooltipParams = ({ hoverInfo }) => {
  const { layer: { props: layerProps } } = hoverInfo
  const {
    visualizations,
    dataPropertyAccessor,
    formatDataKey,
    formatDataValue,
    keyAliases,
    interactions,
  } = layerProps

  const {
    tooltipKeys,
    formatTooltipTitle,
    formatTooltipTitleValue,
    tooltipProps,
  } = interactions?.tooltip || {}
  const fillBasedOn  = visualizations?.fill?.value?.field
  const radiusBasedOn  = visualizations?.radius?.value?.field
  const elevationBasedOn  = visualizations?.elevation?.value?.field
  const arcWidthBasedOn = visualizations?.arcWidth?.value?.field

  const {
    tooltipTitle1,
    tooltipTitle2,
    metricKeys,
    tooltipTitle1Accessor,
    tooltipTitle2Accessor,
    metricAccessor,
  } = tooltipKeys ? tooltipKeys : {}
  const metricKeysArray = metricKeys || []
  // set metricKeys array if no custom keys are given
  if (!metricKeys?.length) {
    ([radiusBasedOn, fillBasedOn, elevationBasedOn, arcWidthBasedOn]).forEach((key) => {
      if (key && !metricKeysArray.includes(key)) {
        metricKeysArray.push(key)
      }
    })
  }
  return {
    tooltipKeys : {
      tooltipTitle1: tooltipTitle1 || '',
      tooltipTitle2: tooltipTitle2 || '',
      tooltipTitle1Accessor: tooltipTitle1Accessor || dataPropertyAccessor,
      tooltipTitle2Accessor: tooltipTitle2Accessor || dataPropertyAccessor,
      metricKeys: metricKeysArray,
      metricAccessor: metricAccessor || dataPropertyAccessor,
      keyAliases,
    },
    formatTooltipTitle,
    formatTooltipTitleValue,
    formatDataKey,
    formatDataValue,
    tooltipProps,
  }
}
