import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const Gradient = styled.div`
  width: 15px;
  height: 80px;
  background-image: linear-gradient(${({ color }) => color}, rgb(0, 0, 0));
`

const Size = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15px;
`

const Circle = styled.div`
  margin: 3px;
  box-sizing: border-box;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border: 1px solid black;
  border-radius: ${({ size }) => `${size / 2}px`};
  background-color: ${({ color }) => color};
`

const propTypes = {
  type: PropTypes.string,
  color: PropTypes.array,
  dots: PropTypes.number,
  size: PropTypes.number,
}
const defaultProps = {
  type: 'gradient',
  color: [255,0,0], // rgba array
  dots: 5,
  size: 5,
}

const arrayToRGBA = o => `rgba(${o.join(',')})`

const LegendSymbol = ({ type, color, dots, size }) => {
  
  if (type === 'gradient') {
    return <Gradient color={arrayToRGBA(color)} />
  }
  if (type === 'size') {
    return (
      <Size>
        {new Array(dots).fill(0).map((_, i) => (
          <Circle
            key={i}
            size={(dots - i) * size + size}
            color={arrayToRGBA(color)}
          />
        ))}
      </Size>
    )
  }
  // TODO: choropleth
  return <></>
}

LegendSymbol.propTypes = propTypes
LegendSymbol.defaultProps = defaultProps

export default LegendSymbol
