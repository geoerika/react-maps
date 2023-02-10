import React, { useMemo, useEffect, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'
import { getLegendItemElements, getValueRangeWidth, getLegendItemDimensions } from './utils'
import {
  LEGEND_TYPE,
  MIN_LEGEND_LINE_WIDTH,
  LEGEND_DOTS,
  LEGEND_RADIUS_SIZE,
  LEGEND_TITLE_BOTTOM_MARGIN,
  LEGEND_TEXT_GAP,
  LEGEND_SYMBOL_WIDTH,
} from '../../constants'


setup(React.createElement)

const LegendBody = styled('div')`
  align-items: center;
  padding-left: ${({ padding }) => padding}rem;
`

const LegendTitle = styled('div')`
  margin:  ${({ marginbottom, marginleft }) => `0 auto ${marginbottom}rem ${marginleft}rem`};
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
  ${({ min, max }) => min || max ? '' : 'align-items: center'};
`

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${LEGEND_TEXT_GAP}rem;
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
`

const LegendSymbolContainer = styled('div')`
  width: ${({ legendelemwidth }) => legendelemwidth}rem;
  margin-left: ${({ symbolcontainerleftmargin }) => symbolcontainerleftmargin}rem;
`

const LegendLineWidth = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${({ legendelemwidth }) => legendelemwidth}rem;
  margin-left: ${({ legendelementsleftmargin }) => legendelementsleftmargin}rem;
`

const LineWidthTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ textcontainerwidth }) => textcontainerwidth}rem;
  margin-left: ${({ textcontainerleftmargin }) => textcontainerleftmargin}rem;
`

const LegendItem = ({ legendItemProps }) => {
  const {
    min,
    max,
    type,
    legendSize,
    symbolMarginLeft,
    setSymbolMarginLeft,
    rightTextOffset,
    setRightTextOffset,
    paddingLeft,
    setOpacity,
    ...symbolProps
  } = legendItemProps

  const { legendElemWidth, title, minValue, maxValue } = getLegendItemElements({ legendItemProps })

  const textMin = useRef(null)
  const textMax = useRef(null)
  const lineTextMin = useRef(null)
  const lineTextMax = useRef(null)

  const [textMinWidth, textMaxWidth, lineTextMaxWidth] =
    getValueRangeWidth({ textMin, textMax, lineTextMin, lineTextMax })

  const { textContainerWidth, symbolContainerLeftMargin, textContainerLeftMargin } =
    getLegendItemDimensions({ legendItemProps, legendElemWidth, textMinWidth, textMaxWidth, legendSize })

  // set symbolMarginLeft as the maxium left margin value of all legend item symbols
  useEffect(() => {
    if (symbolContainerLeftMargin && type !== LEGEND_TYPE.lineWidth) {
      setSymbolMarginLeft(prev => Math.max(prev, symbolContainerLeftMargin))
    }
  }, [symbolContainerLeftMargin, setSymbolMarginLeft, type])

  // sets the maximum width of the upper data range text in all legends, except for line width legend
  useEffect(() => {
    if (type !== LEGEND_TYPE.lineWidth) {
      if ([LEGEND_TYPE.gradient, LEGEND_TYPE.elevation].includes(type)) {
        setRightTextOffset(prev => Math.max(
          prev,
          textMaxWidth / 2,
          textMaxWidth - legendElemWidth / 2 - LEGEND_TEXT_GAP / 2,
        ))
      }
      if (type === LEGEND_TYPE.size) {
        const circleRadius = (LEGEND_DOTS[legendSize] + 0.75) *
          (symbolProps.size || LEGEND_RADIUS_SIZE.default) / 2
        if (circleRadius < textMaxWidth / 2) {
          setRightTextOffset(prev => Math.max(
            prev,
            textMaxWidth / 2 - circleRadius,
            textMaxWidth - legendElemWidth / 2 - LEGEND_TEXT_GAP / 2,
          ))
        }
      }
    }
  }, [type, textMaxWidth, setRightTextOffset, legendElemWidth, legendSize, symbolProps.size])

  // adjust LegendElement left margin so the legend symbols of all legends align vertically
  const legendElementsLeftMargin = useMemo(() => {
    if (symbolMarginLeft > symbolContainerLeftMargin) {
      return symbolMarginLeft - symbolContainerLeftMargin
    }
    return 0
  }, [symbolMarginLeft, symbolContainerLeftMargin])

  // reveal Legend only after the textContainerWidth has been calculated
  useEffect(() => {
    if (textContainerWidth || (min === undefined && max === undefined)) {
      setOpacity(0.9)
    }
  }, [textContainerWidth, setOpacity, min, max])

  const legendTitleMarginBottom = useMemo(() =>{
    if (type === LEGEND_TYPE.lineWidth) {
      return LEGEND_TITLE_BOTTOM_MARGIN.lineWidth
    }
    return LEGEND_TITLE_BOTTOM_MARGIN.default
  }, [type])

  const lineWidthSymbolContainerWidth = useMemo(() => {
    if (rightTextOffset && rightTextOffset >= lineTextMaxWidth + LEGEND_TEXT_GAP) {
      return legendElemWidth
    }
    return Math.max(
      MIN_LEGEND_LINE_WIDTH,
      legendElemWidth + rightTextOffset - lineTextMaxWidth - LEGEND_TEXT_GAP,
    )
  }
  , [rightTextOffset, lineTextMaxWidth, legendElemWidth])

  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody id='legend-body' padding={paddingLeft}>
          <LegendTitle
            id='legend-title'
            legendelemwidth={LEGEND_SYMBOL_WIDTH[legendSize]}
            marginbottom={legendTitleMarginBottom}
            marginleft={legendElementsLeftMargin + symbolContainerLeftMargin}
          >
            {title}
          </LegendTitle>
          {type !== LEGEND_TYPE.lineWidth &&
            <LegendElements
              id='legend-element'
              min={min}
              max={max}
              legendelementsleftmargin={legendElementsLeftMargin}
            >
              <LegendSymbolContainer
                legendelemwidth={legendElemWidth}
                symbolcontainerleftmargin={symbolContainerLeftMargin}
              >
                <LegendSymbol symbolProps={{ min, max, type, legendSize, ...symbolProps }} />
              </LegendSymbolContainer>
              <LegendTextContainer
                textcontainerwidth={textContainerWidth}
                textcontainerleftmargin={textContainerLeftMargin}
              >
                <LegendTextMin ref={textMin}>
                  {minValue.toLocaleString()}
                </LegendTextMin>
                {min !== max && (
                  <LegendTextMax
                    ref={textMax}
                  >
                    {maxValue.toLocaleString()}
                  </LegendTextMax>
                )}
              </LegendTextContainer>
            </LegendElements>
          }
          {/* line width type legend is different than the other legends, therefore it is separate */}
          {type === LEGEND_TYPE.lineWidth &&
            <LegendLineWidth
              legendelementsleftmargin={legendElementsLeftMargin}
              legendelemwidth={lineWidthSymbolContainerWidth + lineTextMaxWidth + LEGEND_TEXT_GAP}
            >
              <LegendSymbolContainer
                symbolcontainerleftmargin={symbolContainerLeftMargin}
                legendelemwidth={lineWidthSymbolContainerWidth}
              >
                <LegendSymbol symbolProps={{ max, min, type, legendSize, ...symbolProps }} />
              </LegendSymbolContainer>
              <LineWidthTextContainer
                textcontainerleftmargin={LEGEND_TEXT_GAP}
              >
                {min !== max &&
                  <LegendTextMin ref={lineTextMin}>
                    {minValue.toLocaleString()}
                  </LegendTextMin>
                }
                <LegendTextMax ref={lineTextMax}>
                  {maxValue.toLocaleString()}
                </LegendTextMax>
              </LineWidthTextContainer>
            </LegendLineWidth>
          }
        </LegendBody>
      )}
      {min === undefined && max === undefined && type === LEGEND_TYPE.icon && (
        <LegendSymbolContainer
          legendelemwidth={legendElemWidth}
          symbolcontainerleftmargin={symbolMarginLeft + paddingLeft}
        >
          <LegendSymbol symbolProps={{ max, type, legendSize, ...symbolProps }} />
        </LegendSymbolContainer>
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
    paddingLeft: PropTypes.number,
    setOpacity: PropTypes.func.isRequired,
    rightTextOffset: PropTypes.number.isRequired,
    setRightTextOffset: PropTypes.func.isRequired,
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
    paddingLeft: 0,
  },
}

export default LegendItem
