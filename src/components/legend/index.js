import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const LegendContainer = styled.div`
  position: absolute;
  z-index: 9999;
  background-color: rgba(255,255,255,0.9);
  padding: 1rem;
  border-radius: 0.5rem;
  ${props => props.position}
`

const LegendText = styled.div`
  float: left;
  margin-left: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: black;
`

const LegendGradient = styled.div`
  float: left;
  width: 15px;
  height: 80px;
  background-image: linear-gradient(rgb(21, 0, 255), rgb(1, 0, 70));
`

// height/width -> wrap

// configurable
// which corner
// color

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
      <LegendGradient />
      <LegendText>{max.toLocaleString()} {label}</LegendText>
      <LegendText>{min.toLocaleString()} {label}</LegendText>
    </LegendContainer>
  )}
</>

Legend.propTypes = propTypes
Legend.defaultProps = defaultProps

export default Legend
