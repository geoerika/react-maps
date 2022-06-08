import React, { useMemo, useEffect, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'
import { getLegendItemElements, getValueRangeWidth, getLegendItemDimensions } from './utils'
import { LEGEND_SYMBOL_WIDTH } from '../../constants'


setup(React.createElement)

const LegendBody = styled('div')`
  align-items: center;
  margin-top: 0.75rem;
`

const LegendTitle = styled('div')`
  margin: 0 auto 0.625rem auto;
  text-align: center;
  fontWeight: 700;
  max-width: ${({ legendelemwidth }) => legendelemwidth}rem;
  overflow-wrap: anywhere;
`

const LegendElements = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: ${({ legendelementsleftmargin }) => legendelementsleftmargin}rem;
  ${({ max }) => max ? '' : 'align-items: center'};
`

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${({ textcontainerwidth }) => textcontainerwidth}rem;
  margin-left: ${({ textcontainerleftmargin }) => textcontainerleftmargin}rem;
  margin-top: 0.325rem;
`

const LegendTextMin = styled('div', forwardRef)`
  color: black;
`

const LegendTextMax = styled('div', forwardRef)`
  color: black;
`

const LegendSymbolContainer = styled('div')`
  width: ${({ legendelemwidth }) => legendelemwidth}rem;
  margin-left: ${({ symbolcontainerleftmargin }) => symbolcontainerleftmargin}rem;
`

const LegendItem = ({ legendItemProps }) => {

  const {
    min,
    max,
    type,
    legendSize,
    symbolMarginLeft,
    setSymbolMarginLeft,
    setOpacity,
    ...symbolProps
  } = legendItemProps

  const { legendElemWidth, title, minValue, maxValue } = getLegendItemElements({ legendItemProps })

  const textMin = useRef(null)
  const textMax = useRef(null)

  const [textMinWidth, textMaxWidth] = getValueRangeWidth({ textMin, textMax })

  const { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin } =
    getLegendItemDimensions({ legendItemProps,  legendElemWidth, textMinWidth, textMaxWidth })

  // set symbolMarginLeft as the maxium left margin value of all legend item symbols
  useEffect(() => {
    if (symbolContainerLeftMargin) {
      setSymbolMarginLeft(prev => Math.max(prev, symbolContainerLeftMargin))
    }
  }, [symbolContainerLeftMargin, setSymbolMarginLeft])

  // adjust LegendElement left margin so the legend symbols of all legends align vertically
  const legendElementsLeftMargin = useMemo(() => {
    if (symbolMarginLeft > symbolContainerLeftMargin) {
      return symbolMarginLeft - symbolContainerLeftMargin
    }
    return 0
  }, [symbolMarginLeft, symbolContainerLeftMargin])

  // reveal Legend only after the textContainerWidth has been calculated
  useEffect(() => {
    if (textContainerWidth) {
      setOpacity(0.9)
    }
  }, [textContainerWidth, setOpacity])

  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody>
          <LegendTitle legendelemwidth={LEGEND_SYMBOL_WIDTH[legendSize]}>{title}</LegendTitle>
          <LegendElements max={max} legendelementsleftmargin={legendElementsLeftMargin}>
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
    keyAliases: PropTypes.object,
    formatLegendTitle: PropTypes.func,
    formatDataKey: PropTypes.func,
    formatDataValue: PropTypes.object,
    type: PropTypes.string.isRequired,
    legendSize: PropTypes.string.isRequired,
    symbolProps: PropTypes.object,
    symbolMarginLeft: PropTypes.number.isRequired,
    setSymbolMarginLeft: PropTypes.func.isRequired,
    setOpacity: PropTypes.func.isRequired,
  }),
}

LegendItem.defaultProps = {
  legendItemProps: {
    label: '',
    max: undefined,
    min: undefined,
    keyAliases: undefined,
    formatLegendTitle: d => d,
    formatDataKey: d => d,
    formatDataValue: undefined,
    symbolProps: undefined,
  },
}

export default LegendItem
