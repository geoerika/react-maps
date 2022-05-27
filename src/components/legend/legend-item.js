import React, { useMemo, useEffect, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'
import { getLegendItemElements, getValueRangeWidth, getLegendItemDimensions } from './utils'
import { LEGEND_TYPE, LEGEND_SYMBOL_WIDTH, MIN_LEGEND_LINE_WIDTH } from '../../constants'


setup(React.createElement)

const TEXT_CONTAINER_LEFT_MARGIN = 0.5

const LegendBody = styled('div')`
  align-items: center;
  margin-top: 0.625rem;
`

const LegendTitle = styled('div')`
  margin: 0 auto 0.4rem auto;
  text-align: center;
  font-weight: 700;
  font-size: 0.625rem;
  color: ${getTailwindConfigColor('secondary-900')};
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
  font-size: 0.625rem;
  color: black;
  marginBottom: 0.1rem;
  color: ${getTailwindConfigColor('secondary-900')};
`

const LegendTextMax = styled('div', forwardRef)`
  font-size: 0.625rem;
  color: black;
  color: ${getTailwindConfigColor('secondary-900')};
  margin-left: ${({ marginleft }) => marginleft}rem;
`

const LegendSymbolContainer = styled('div')`
  width: ${({ legendelemwidth }) => legendelemwidth}rem;
  margin-left: ${({ symbolcontainerleftmargin }) => symbolcontainerleftmargin}rem;
`

const LegendLineWidth = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: ${({ legendelementsleftmargin }) => legendelementsleftmargin}rem;
`

const LineWidthTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ textcontainerwidth }) => textcontainerwidth}rem;
  margin-top: -0.4rem;
  margin-left: ${TEXT_CONTAINER_LEFT_MARGIN}rem;
`

const LegendItem = ({ legendItemProps }) => {
  const {
    min,
    max,
    type,
    legendSize,
    symbolMarginLeft,
    setSymbolMarginLeft,
    maxTextContainer,
    setMaxTextContainer,
    setOpacity,
    ...symbolProps
  } = legendItemProps

  const { legendElemWidth, title, minValue, maxValue } = getLegendItemElements({ legendItemProps })

  const textMin = useRef(null)
  const textMax = useRef(null)
  const lineTextMin = useRef(null)
  const lineTextMax = useRef(null)

  const [textMinWidth, textMaxWidth, lineTextMaxWidth] =
    getValueRangeWidth({ textMin, textMax, lineText: min === max ? lineTextMin : lineTextMax })

  const { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin } =
    getLegendItemDimensions({ legendItemProps,  legendElemWidth, textMinWidth, textMaxWidth })

  // set symbolMarginLeft as the maxium left margin value of all legend item symbols
  useEffect(() => {
    if (symbolContainerLeftMargin) {
      setSymbolMarginLeft(prev => Math.max(prev, symbolContainerLeftMargin))
    }
  }, [symbolContainerLeftMargin, setSymbolMarginLeft])

  // sets the maximum width of all legend item text containers
  useEffect(() => {
    if (textContainerWidth) {
      setMaxTextContainer(prev => Math.max(prev, textContainerWidth))
    }
  }, [textContainerWidth, setMaxTextContainer])

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
          <LegendTitle legendelemwidth={LEGEND_SYMBOL_WIDTH[legendSize]}>
            {title}
          </LegendTitle>
          {type !== LEGEND_TYPE.lineWidth &&
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
                <LegendTextMin ref={textMin}>
                  {minValue.toLocaleString()}
                </LegendTextMin>
                {max > 0 && (
                  <LegendTextMax
                    ref={textMax}
                    marginleft={type === LEGEND_TYPE.gradient ? TEXT_CONTAINER_LEFT_MARGIN : 0}
                  >
                    {maxValue.toLocaleString()}
                  </LegendTextMax>
                )}
              </LegendTextContainer>
            </LegendElements>
          }
          {/* line width type legend is different than the other legends, therefore it is separate */}
          {type === LEGEND_TYPE.lineWidth &&
            <LegendLineWidth legendelementsleftmargin={legendElementsLeftMargin}>
              <LegendSymbolContainer
                symbolcontainerleftmargin={symbolContainerLeftMargin}
                legendelemwidth={
                  Math.max(
                    MIN_LEGEND_LINE_WIDTH,
                    Math.max(maxTextContainer, LEGEND_SYMBOL_WIDTH[legendSize]) -
                    TEXT_CONTAINER_LEFT_MARGIN -
                      lineTextMaxWidth -
                      legendElementsLeftMargin,
                  )
                }
              >
                <LegendSymbol symbolProps={{ max, min, type, legendSize, ...symbolProps }} />
              </LegendSymbolContainer>
              <LineWidthTextContainer
              >
                <LegendTextMin ref={lineTextMin}>
                  {minValue.toLocaleString()}
                </LegendTextMin>
                {min !== max && max > 0 && (
                  <LegendTextMax ref={lineTextMax}>
                    {maxValue.toLocaleString()}
                  </LegendTextMax>
                )}
              </LineWidthTextContainer>
            </LegendLineWidth>
          }
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
    maxTextContainer: PropTypes.func.isRequired,
    setMaxTextContainer: PropTypes.func.isRequired,
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
