import React from 'react'
import PropTypes from 'prop-types'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'


setup(React.createElement)

const LegendBody = styled('div')`
  align-items: center;
  margin-top: .75rem;
`

const LegendTitle = styled('div')`
  margin: 0 auto 10px auto;
  text-align: center;
  fontWeight: 700;
  max-width: ${({ legendelemwidth }) => legendelemwidth};
  overflow-wrap: anywhere;
`

const LegendElements = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${({ textcontainerwidth }) => textcontainerwidth};
  padding: ${({ textcontainerpadding }) => textcontainerpadding};
  margin-top: 5px;
`

const LegendText = styled('div')`
  color: black;
  margin: ${({ max }) => max ? '' : 'auto'};
`

const LegendSymbolContainer = styled('div')`
  width: ${({ max, legendelemwidth }) => max ? legendelemwidth : '20px'};
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
  const legendElemWidth = legendSize === 'full' ? '120px' : '80px'
  let textContainerWidth = '20px'
  if (max > 0 ) {
    textContainerWidth = legendSize === 'full' ? '130px' : '90px'
    if (type === 'size') {
      textContainerWidth = legendElemWidth
    }
  }
  let textContainerPadding = '0px'
  if (max > 0) {
    textContainerPadding = legendSize === 'full' ? '0 0 0 3px' : '0 3px 0 5px'
    if (type === 'size' ) {
      textContainerPadding = legendSize === 'full' ? '0 5px 0 3px' : '0'
    }
  }
  const title = formatLegendTitle(metricAliases?.[label] || formatPropertyLabel(label))
  const [minValue, maxValue] = formatData?.[label] ?
    [formatData[label](min), formatData[label](max)] :
    [min, max]
  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody>
          <LegendTitle legendelemwidth={legendElemWidth}>{title}</LegendTitle>
          <LegendElements>
            <LegendSymbolContainer max={max} legendelemwidth={legendElemWidth}>
              <LegendSymbol symbolProps={{ max, type, legendSize,...symbolProps }} />
            </LegendSymbolContainer>
            <LegendTextContainer
              textcontainerpadding={textContainerPadding}
              textcontainerwidth={textContainerWidth}
            >
              <LegendText max={max}>{minValue.toLocaleString()}</LegendText>
              {max > 0 && <LegendText max={max}>{maxValue.toLocaleString()}</LegendText>}
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
