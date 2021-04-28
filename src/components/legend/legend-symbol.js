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
  width: 10px;
  margin-left: auto;
  margin-right: auto;
  border-left: 1px solid black;
  border-right: 1px solid black;
  background-color: ${({ color }) => color};
`

const propTypes = {
  symbolProps: PropTypes.shape({
    type: PropTypes.string,
    max: PropTypes.number,
    minColor: PropTypes.string,
    maxColor: PropTypes.string,
    dots: PropTypes.number,
    size: PropTypes.number,
    zeroRadiusSize: PropTypes.number,
  }),
}
const defaultProps = {
  symbolProps: {
    type: 'gradient',
    max: undefined,
    minColor: 'rgb(0,0,0)',
    maxColor: 'rgb(255,0,0)',
    dots: 5,
    size: 5,
    zeroRadiusSize: 20,
  },
}

const LegendSymbol = ({ symbolProps }) => {
  const { max, minColor, maxColor, dots, size, zeroRadiusSize, type } = symbolProps
  if (type === 'elevation') {
    return (
      <Size>
        {max > 0 &&
          <HeightWrapper margin='top'>
            <Height height={40} color={maxColor}/>
          </HeightWrapper>
        }
        <HeightWrapper margin='bottom'>
          <Height height={10} color={maxColor}/>
        </HeightWrapper>
      </Size>
    )
  }
  if (type === 'gradient') {
    const [minGradCol, maxGradCol] =  max > 0 ? [minColor, maxColor] : [minColor, minColor]
    return <Gradient min={minGradCol} max={maxGradCol} />
  }
  if (type === 'size') {
    return (
      <Size>
        {max > 0 ?
          new Array(dots).fill(0).map((_, i) => (
            <Circle
              key={i}
              size={(dots - i) * size + size}
              color={maxColor}
            />
          )) :
          <Circle
            size={zeroRadiusSize}
            color={maxColor}
          />
        }
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
