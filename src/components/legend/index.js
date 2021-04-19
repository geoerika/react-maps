import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import { styled, setup } from 'goober'

import LegendSymbol from './legend-symbol'


setup(React.createElement)

const LegendContainer = styled('div')(({ num_legends, position, typography }) => ({
  ...typography,
  display: 'flex',
  position: 'absolute',
  zIndex: 9998,
  backgroundColor: 'rgba(255,255,255,0.9)',
  padding: '1rem',
  borderRadius: '0.2rem',
  cursor: num_legends > 1 ? 'pointer' : 'default',
  ...position,
}))

const LegendTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

const LegendText = styled('div')`
  ${props => props['legend-text-top'] ? 'flex-grow: 1;' : ''};
  margin-left: 1rem;
  color: black;
`

const LegendSymbolContainer = styled('div')``

const propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  legends: PropTypes.arrayOf(PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number,
    label: PropTypes.string,
  })),
}

const defaultProps = {
  position: 'top-left',
  legends: [
    {
      max: undefined,
      min: undefined,
      label: '',
    },
  ],
}

const Legend = ({ position, legends, typography }) => {
  let objPosition = {}
  objPosition[position.split('-')[0]] = '1rem'
  objPosition[position.split('-')[1]] = '1rem'
  const [activeLegend, setActiveLegend] = useState(0)
  const handleLegendChange = () => setActiveLegend(o => o === legends.length - 1 ? 0 : o + 1)
  const { max, min, label, ...symbolProps } = legends[activeLegend] || {}

  return (
    <>
      { max !== undefined && min !== undefined && (
        <LegendContainer
          num_legends={legends.length}
          onClick={handleLegendChange}
          position={objPosition}
          typography={typography}
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

Legend.propTypes = { ...propTypes, ...typographyPropTypes }
Legend.defaultProps = { ...defaultProps,  ...typographyDefaultProps }

export default Legend
