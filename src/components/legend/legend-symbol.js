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
  // TODO: choropleth using import { scaleThreshold } from 'd3-scale'
  // potentially different methods of calculating domain, e.g. linear vs quartile
  /*
    export const COLOR_SCALE = scaleThreshold()
      .domain([-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
      .range([
        [65, 182, 196],
        [127, 205, 187],
        [199, 233, 180],
        [237, 248, 177],
        // zero
        [255, 255, 204],
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38]
      ]);
  */
  return <></>
}

LegendSymbol.propTypes = propTypes
LegendSymbol.defaultProps = defaultProps

export default LegendSymbol
