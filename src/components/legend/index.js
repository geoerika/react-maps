import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const LegendContainer = styled.div`
  width: 135px;
  height: 92px;
  overflow-x: 'scroll';
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  background-color: rgba(255,255,255,0.9);
  padding: 1rem;
  border-radius: 0.5rem;
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

// configurable
// height/width
// which corner
// color

// EVENTUALLY: represent whichever visual elements are being used in a basedOn
const Legend = ({ max, min, label }) => <>
  { max !== undefined && min !== undefined && (
    <LegendContainer>
      <LegendGradient />
      <LegendText>{max.toLocaleString()} {label}</LegendText>
      <LegendText>{min.toLocaleString()} {label}</LegendText>
    </LegendContainer>
  )}
</>

export default Legend
