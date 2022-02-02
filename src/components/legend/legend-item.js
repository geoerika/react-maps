import React, { useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'
import { LEGEND_TYPE, LEGEND_SYMBOL_WIDTH } from '../../constants'


setup(React.createElement)

const LegendBody = styled('div')`
  align-items: center;
  margin-top: .75rem;
`

const LegendTitle = styled('div')`
  margin: 0 auto 10px auto;
  text-align: center;
  fontWeight: 700;
  max-width: ${({ legendelemwidth }) => legendelemwidth}px;
  overflow-wrap: anywhere;
`

const LegendElements = styled('div')`
  display: flex;
  flex-direction: column;
  ${({ max }) => max ? '' : 'align-items: center'};
`

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${({ textcontainerwidth }) => textcontainerwidth}px;
  margin-left: ${({ textcontainerleftmargin }) => textcontainerleftmargin}px;
  margin-top: 5px;
`

const LegendTextMin = styled('div', forwardRef)`
  color: black;
`

const LegendTextMax = styled('div', forwardRef)`
  color: black;
`

const LegendSymbolContainer = styled('div')`
  width: ${({ legendelemwidth }) => legendelemwidth}px;
  margin-left: ${({ symbolcontainerleftmargin }) => symbolcontainerleftmargin}px;
`

const LegendItem = ({ legendItemProps }) => {
  const {
    min,
    max,
    label,
    metricAliases,
    formatLegendTitle = d => d,
    formatPropertyLabel = d => d,
    formatData,
    type,
    legendSize,
    ...symbolProps
  } = legendItemProps
  const legendElemWidth = max ? LEGEND_SYMBOL_WIDTH[legendSize] : LEGEND_SYMBOL_WIDTH.zero
  const title = formatLegendTitle(metricAliases?.[label] || formatPropertyLabel(label))
  const [minValue, maxValue] = formatData?.[label] ?
    [formatData[label](min), formatData[label](max)] :
    [min, max]

  const textMin = useRef(null)
  const textMax = useRef(null)
  const textMinWidth = textMin.current?.getBoundingClientRect()?.width
  const textMaxWidth = textMax.current?.getBoundingClientRect()?.width

  /*
   * text container width for gradient and elevation legends, where value labels centres align with
   * the edges of the legend symbol container
   */
  let textContainerWidth = textMinWidth / 2 + textMaxWidth / 2 + legendElemWidth

  // for radius symbols, the width is different, we position text centred with the margin symbols
  let symbolContainerLeftMargin = 0
  let textContainerLeftMargin = 0
  if (type !== LEGEND_TYPE.size) {
    symbolContainerLeftMargin = textMinWidth / 2
  }
  if (type === LEGEND_TYPE.size) {
    const { dots, size } = symbolProps
    // for radius (size) width is samller, as the value labels align with the centers of the edge circles
    textContainerWidth = textContainerWidth - (2.5 + dots) * size / 2 // half of each circle size
    const smallSymbolRadius = 1.75 * size / 2
    if (smallSymbolRadius <= textMinWidth / 2) {
      symbolContainerLeftMargin = textMinWidth / 2 - smallSymbolRadius
    } else {
      textContainerLeftMargin = smallSymbolRadius - textMinWidth / 2
    }
  }

  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody>
          <LegendTitle legendelemwidth={LEGEND_SYMBOL_WIDTH[legendSize]}>{title}</LegendTitle>
          <LegendElements max={max}>
            <LegendSymbolContainer
              legendelemwidth={legendElemWidth}
              symbolcontainerleftmargin={symbolContainerLeftMargin}
            >
              <LegendSymbol symbolProps={{ max, type, legendSize, ...symbolProps }} />
            </LegendSymbolContainer>
            <LegendTextContainer
              textcontainerwidth={textContainerWidth}
              textcontainerleftmargin={textContainerLeftMargin}
            >
              <LegendTextMin ref={textMin}>{minValue.toLocaleString()}</LegendTextMin>
              {max > 0 && <LegendTextMax ref={textMax}>{maxValue.toLocaleString()}</LegendTextMax>}
            </LegendTextContainer>
          </LegendElements>
        </LegendBody>
      )}
    </>
  )
}

LegendItem.propTypes = {
  legendItemProps: PropTypes.shape({
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    metricAliases: PropTypes.object,
    formatLegendTitle: PropTypes.func,
    formatPropertyLabel: PropTypes.func,
    formatData: PropTypes.object,
    type: PropTypes.string,
    legendSize: PropTypes.string.isRequired,
    symbolProps: PropTypes.object,
  }),
}

LegendItem.defaultProps = {
  legendItemProps: {
    label: '',
    max: undefined,
    min: undefined,
    metricAliases: undefined,
    formatLegendTitle: d => d,
    formatPropertyLabel: d => d,
    formatData: undefined,
    type: '',
    symbolProps: undefined,
  },
}

export default LegendItem
