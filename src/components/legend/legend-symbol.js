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
  justify-content: space-between;
  width: 15px;
`

const Circle = styled.div`
  width: ${({ size }) => `${size}px`};
  border-radius: ${({ size }) => `${size / 2}px`};
  background-color: ${({ color }) => color};
`

const propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  dots: PropTypes.number,
  size: PropTypes.number,
}
const defaultProps = {
  type: 'gradient',
  color: 'rgb(255,0,0)',
  dots: 5,
  size: 5,
}

const LegendSymbol = ({ type, color, dots, size }) => {
  
  if (type === 'gradient') {
    return <Gradient color={color} />
  }
  if (type === 'size') {
    return (
      <Size>
        {new Array(dots).fill(0).map((_, i) => (
          <Circle
            key={i}
            size={i * size + size}
            color={color}
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
