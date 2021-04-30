import React from 'react'
import PropTypes from 'prop-types'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'


setup(React.createElement)

const LegendBody = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`

const LegendTitle = styled('div')`
  margin: 0 0 10px 0;
  fontWeight: 700;
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
  width: ${({ type }) => type === 'size' ? '115px' : '128px'};
  padding: ${({ type }) => type === 'size' ? '0 5px 0 3px' : '0 0 0 3px'};
  margin-top: 5px;
`

const LegendText = styled('div')`
  color: black;
  margin: ${({ max }) => max ? '' : 'auto'};
`

const LegendSymbolContainer = styled('div')`
  width: 120px;
`

const propTypes = {
  legendItemProps: PropTypes.shape({
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    metricAliases: PropTypes.object,
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
    type: '',
    symbolProps: undefined,
  },
}

const LegendItem = ({ legendItemProps }) => {
  const { min, max, label, metricAliases, type, ...symbolProps } = legendItemProps
  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody>
          <LegendTitle>{`${metricAliases?.[label] || label}`}</LegendTitle>
          <LegendElements>
            <LegendSymbolContainer>
              <LegendSymbol symbolProps={{ max, type, ...symbolProps }} />
            </LegendSymbolContainer>
            <LegendTextContainer type={type}>
              <LegendText max={max}>{min.toLocaleString()}</LegendText>
              {max > 0 && <LegendText max={max}>{max.toLocaleString()}</LegendText>}
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
