import React from 'react'
import PropTypes from 'prop-types'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'


setup(React.createElement)

const LegendBody = styled('div')`
  align-items: center;
  margin-top: 1rem;
`

const LegendTitle = styled('div')`
  margin: 0 auto 10px auto;
  text-align: center;
  fontWeight: 700;
  max-width: 160px;
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
  width: ${({ type, max }) =>
    max > 0 ?
      (type === 'size' ? '115px' : '128px') :
      '20px'};
  padding: ${({ type, max }) =>
    max > 0 ?
      (type === 'size' ? '0 5px 0 3px' : '0 0 0 3px') :
      '0px'};
  margin-top: 5px;
`

const LegendText = styled('div')`
  color: black;
  margin: ${({ max }) => max ? '' : 'auto'};
`

const LegendSymbolContainer = styled('div')`
  width: ${({ max }) => max ? '120px' : '20px'};
`

const propTypes = {
  legendItemProps: PropTypes.shape({
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    metricAliases: PropTypes.object,
    truncateLegendTitle: PropTypes.func,
    formatData: PropTypes.object,
    type: PropTypes.string,
    symbolProps: PropTypes.object,
  }),
}

const defaultProps = {
  legendItemProps: {
    label: '',
    max: undefined,
    min: undefined,
    metricAliases: undefined,
    truncateLegendTitle: d => d,
    formatData: undefined,
    type: '',
    symbolProps: undefined,
  },
}

const LegendItem = ({ legendItemProps }) => {
  const {
    min,
    max,
    label,
    metricAliases,
    truncateLegendTitle,
    formatData,
    type,
    ...symbolProps
  } = legendItemProps
  const title = truncateLegendTitle(metricAliases?.[label] || label)
  const [minValue, maxValue] = formatData?.[label] ?
    [formatData[label](min), formatData[label](max)] :
    [min, max]
  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody>
          <LegendTitle>{title}</LegendTitle>
          <LegendElements>
            <LegendSymbolContainer max={max}>
              <LegendSymbol symbolProps={{ max, type, ...symbolProps }} />
            </LegendSymbolContainer>
            <LegendTextContainer type={type} max={max}>
              <LegendText max={max}>{minValue.toLocaleString()}</LegendText>
              {max > 0 && <LegendText max={max}>{maxValue.toLocaleString()}</LegendText>}
            </LegendTextContainer>
          </LegendElements>
        </LegendBody>
      )}
    </>
  )
}

LegendItem.propTypes = { ...propTypes, ...typographyPropTypes }
LegendItem.defaultProps = { ...defaultProps,  ...typographyDefaultProps }

export default LegendItem
