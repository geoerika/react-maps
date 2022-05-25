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
    formatData,
    formatPropertyLabel,
    metricAliases,
    interactions,
  } = layerProps

  const { tooltipKeys, formatTooltipTitle, tooltipProps } = interactions?.tooltip || {}
  const fillBasedOn  = visualizations?.fill?.value?.field
  const radiusBasedOn  = visualizations?.radius?.value?.field
  const elevationBasedOn  = visualizations?.elevation?.value?.field

  const {
    name,
    id,
    sourcePOIId,
    targetPOIId,
    metricKeys,
    metricAccessor,
    nameAccessor,
    idAccessor,
    sourcePOIIdAccessor,
    targetPOIIdAccessor,
  } = tooltipKeys ? tooltipKeys : {}
  const metricKeysArray = [...(tooltipKeys?.metricKeys || [])]
  // set metricKeys array if no custom keys are given
  if (!metricKeys?.length) {
    ([radiusBasedOn, fillBasedOn, elevationBasedOn]).forEach((key) => {
      if (key) {
        metricKeysArray.push(key)
      }
    })
  }
  return {
    tooltipKeys : {
      name: name || 'name',
      id: id || 'id',
      sourcePOIId,
      targetPOIId,
      nameAccessor: nameAccessor || dataPropertyAccessor,
      idAccessor: idAccessor || dataPropertyAccessor,
      metricKeys: metricKeysArray,
      metricAccessor: metricAccessor || dataPropertyAccessor,
      sourcePOIIdAccessor: sourcePOIIdAccessor || dataPropertyAccessor,
      targetPOIIdAccessor: targetPOIIdAccessor || dataPropertyAccessor,
      metricAliases,
    },
    formatData,
    formatTooltipTitle,
    formatPropertyLabel,
    tooltipProps,
  }
}
