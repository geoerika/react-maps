import React from 'react'
import PropTypes from 'prop-types'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'


setup(React.createElement)

const LegendBody = styled('div')`
  background-color: rgba(255,255,255,0.9);
  margin-bottom: 5px;
  padding: 1rem;
  border-radius: 0.2rem;
`

const LegendTitle = styled('h3')`
  margin: 0 0 10px 0;
`

const LegendElements = styled('div')`
  display: flex;
  flex-direction: row;
`

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  ${({ max }) => max ? '' : 'margin-bottom: 2px;'};
`

const LegendText = styled('div')`
  ${props => props['legend-text-top'] ? 'flex-grow: 1;' : ''};
  margin-left: 1rem;
  color: black;
`

const LegendSymbolContainer = styled('div')``

const propTypes = {
  legendItemProps: PropTypes.shape({
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    metricAliases: PropTypes.object,
    symbolProps: PropTypes.object,
  }),
}

const defaultProps = {
  legendItemProps: {
    label: '',
    max: undefined,
    min: undefined,
    metricAliases: undefined,
    symbolProps: undefined,
  },
}

const LegendItem = ({ legendItemProps }) => {
  const { min, max, label, metricAliases, ...symbolProps } = legendItemProps
  return (
    <>
      {max !== undefined && min !== undefined && (
        <LegendBody>
          <LegendTitle>{`${metricAliases?.[label] || label}`}</LegendTitle>
          <LegendElements>
            <LegendSymbolContainer>
              <LegendSymbol symbolProps={{ max, ...symbolProps }} />
            </LegendSymbolContainer>
            <LegendTextContainer max={max}>
              {max > 0 && <LegendText legend-text-top={ top }>{max.toLocaleString()}</LegendText>}
              <LegendText>{min.toLocaleString()}</LegendText>
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
