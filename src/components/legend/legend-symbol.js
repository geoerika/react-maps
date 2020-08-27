import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

setup(React.createElement)

const Gradient = styled('div')`
  width: 15px;
  height: 80px;
  background-image: linear-gradient(${({ max, min }) => `${max}, ${min}`});
`

const Size = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15px;
`

const Circle = styled('div')`
  margin: 3px;
  box-sizing: border-box;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border: 1px solid black;
  border-radius: ${({ size }) => `${size / 2}px`};
  background-color: ${({ color }) => color};
`

const HeightWrapper = styled('div')`
  flex-grow: 1;
  width: 80%;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  margin: 5px 0 5px 0;
`

const Height = styled('div')`
  height: ${({ height }) => height}px;
  width: 0;
  margin-left: auto;
  margin-right: auto;
  border-left: 1px solid black;
`

const propTypes = {
  type: PropTypes.string,
  minColor: PropTypes.string,
  maxColor: PropTypes.string,
  dots: PropTypes.number,
  size: PropTypes.number,
}
const defaultProps = {
  type: 'gradient',
  minColor: 'rgb(0,0,0)',
  maxColor: 'rgb(255,0,0)',
  dots: 5,
  size: 5,
}

const LegendSymbol = ({ type, minColor, maxColor, dots, size }) => {
  if (type === 'elevation') {
    return (
      <Size>
        <HeightWrapper margin='top'>
          <Height height={40}  />
        </HeightWrapper>
        <HeightWrapper margin='bottom'>
          <Height height={10} />
        </HeightWrapper>
      </Size>
    )
  }
  if (type === 'gradient') {
    return <Gradient min={minColor} max={maxColor} />
  }
  if (type === 'size') {
    return (
      <Size>
        {new Array(dots).fill(0).map((_, i) => (
          <Circle
            key={i}
            size={(dots - i) * size + size}
            color={maxColor}
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
