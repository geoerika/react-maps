import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'


setup(React.createElement)

const LegendContainer = styled('div')`
  display: flex;
  position: absolute;
  z-index: 9998;
  background-color: rgba(255,255,255,0.9);
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: ${props => props['num-legends'] > 1 ? 'pointer' : 'default'};
  ${props => props.position}
`

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

const LegendText = styled('div')`
  ${props => props['legend-text-top'] ? 'flex-grow: 1;' : ''};
  margin-left: 1rem;
  font-size: 1rem;
  color: black;
`

const LegendSymbolContainer = styled('div')``

const propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  legends: PropTypes.arrayOf(PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number,
    label: PropTypes.string,
  }))
}

const defaultProps = {
  position: 'top-left',
  legends: [
    {
      max: undefined,
      min: undefined,
      label: '',
    }
  ]
}

const Legend = ({ position, legends }) => {
  const [activeLegend, setActiveLegend] = useState(0)
  const handleLegendChange = () => setActiveLegend(o => o === legends.length - 1 ? 0 : o + 1)
  const { max, min, label, ...symbolProps } = legends[activeLegend] || {}

  return (
    <>
      { max !== undefined && min !== undefined && (
        <LegendContainer
          num-legends={legends.length}
          onClick={handleLegendChange}
          position={`${position.split('-')[0]}: 1rem; ${position.split('-')[1]}: 1rem;`}
        >
          <LegendSymbolContainer>
            <LegendSymbol {...symbolProps} />
          </LegendSymbolContainer>
          <LegendTextContainer>
            <LegendText legend-text-top={ top }>{max.toLocaleString()} {label}</LegendText>
            <LegendText>{min.toLocaleString()} {label}</LegendText>
          </LegendTextContainer>
        </LegendContainer>
      )}
    </>
  )
}

Legend.propTypes = propTypes
Legend.defaultProps = defaultProps

export default Legend
