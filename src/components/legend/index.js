import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const LegendContainer = styled.div`
  display: flex;
  position: absolute;
  z-index: 9999;
  background-color: rgba(255,255,255,0.9);
  padding: 1rem;
  border-radius: 0.5rem;
  ${props => props.position}
`

const LegendTextContainer = styled.div`
  display: flex;
  flex-grow: 4;
  flex-direction: column;
`

const LegendText = styled.div`
  ${props => props.top ? 'flex-grow: 1;' : ''};
  margin-left: 1rem;
  font-size: 1rem;
  color: black;
`

const LegendSymbolContainer = styled.div`
  flex-grow: 1;
  align-self: flex-start;
`

const LegendGradient = styled.div`
  width: 15px;
  height: 80px;
  background-image: linear-gradient(rgb(21, 0, 255), rgb(1, 0, 70));
`

const propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  label: PropTypes.string,
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
}

const defaultProps = {
  max: undefined,
  min: undefined,
  label: '',
  position: 'top-left'
}
// EVENTUALLY: represent whichever visual elements are being used in a basedOn
const Legend = ({ max, min, label, position }) => <>
  { max !== undefined && min !== undefined && (
    <LegendContainer position={`${position.split('-')[0]}: 1rem; ${position.split('-')[1]}: 1rem;`}>
      <LegendSymbolContainer><LegendGradient /></LegendSymbolContainer>
      <LegendTextContainer>
        <LegendText top>{max.toLocaleString()} {label}</LegendText>
        <LegendText>{min.toLocaleString()} {label}</LegendText>
      </LegendTextContainer>
    </LegendContainer>
  )}
</>

Legend.propTypes = propTypes
Legend.defaultProps = defaultProps

export default Legend
