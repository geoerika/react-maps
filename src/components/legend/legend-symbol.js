import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { LEGEND_SIZE } from '../../constants'


setup(React.createElement)

const Gradient = styled('div')`
  height: 15px;
  margin: auto;
  background-image: linear-gradient(${({ mincolor, maxcolor }) => `to right, ${mincolor}, ${maxcolor}`});
`

const Size = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ max }) => max ? 'space-between' : 'center'};
`

const Circle = styled('div')`
  box-sizing: border-box;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border: 1px solid ${({ linecolor }) => linecolor};
  border-radius: ${({ size }) => `${size / 2}px`};
  background-color: ${({ color }) => color};
`

const HeightWrapper = styled('div')`
  border-left: ${({ pos }) => pos ? '1px solid black' : ''};
  border-right: ${({ pos }) => pos ? '' : '1px solid black'};
  height: 15px;
  display: flex;
  align-items: center;
`

const Height = styled('div')`
  width: ${({ width }) => width}px;
  height: 7px;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  background-color: ${({ color }) => color};
`

const LegendSymbol = ({ symbolProps }) => {
  const {
    max,
    minColor,
    maxColor,
    dots,
    size,
    legendSize,
    zeroRadiusSize,
    type,
    symbolLineColor,
  } = symbolProps
  if (type === 'elevation') {
    return (
      <Size max={max}>
        <HeightWrapper pos={'left'}>
          <Height width={legendSize === LEGEND_SIZE.large.label ? 21 : 16} color={!max ? minColor : maxColor} />
        </HeightWrapper>
        {max > 0 &&
          <HeightWrapper>
            <Height width={legendSize === LEGEND_SIZE.large.label ? 84 : 50} color={maxColor} />
          </HeightWrapper>
        }
      </Size>
    )
  }
  if (type === 'gradient') {
    const [minGradCol, maxGradCol] =  max > 0 ? [minColor, maxColor] : [minColor, minColor]
    return <Gradient mincolor={minGradCol} maxcolor={maxGradCol} />
  }
  if (type === 'size') {
    return (
      <Size max={max}>
        {max > 0 ?
          new Array(legendSize === LEGEND_SIZE.large.label ? dots : 4).fill(0).map((_, i) => (
            <Circle
              key={i}
              size={(i + .75) * size + size}
              color={maxColor}
              max={max}
              linecolor={symbolLineColor}
            />
          )) :
          <Circle
            size={zeroRadiusSize}
            color={!max ? minColor : maxColor}
            max={max}
            linecolor={symbolLineColor}
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

LegendSymbol.propTypes = {
  symbolProps: PropTypes.shape({
    type: PropTypes.string,
    legendSize: PropTypes.string.isRequired,
    fillBasedOn: PropTypes.string,
    max: PropTypes.number,
    minColor: PropTypes.string,
    maxColor: PropTypes.string,
    dots: PropTypes.number,
    size: PropTypes.number,
    zeroRadiusSize: PropTypes.number,
    symbolLineColor: PropTypes.string,
  }),
}

LegendSymbol.defaultProps = {
  symbolProps: {
    type: 'gradient',
    fillBasedOn: '',
    max: undefined,
    minColor: 'rgb(0,0,0)',
    maxColor: 'rgb(255,0,0)',
    dots: 5,
    size: 5,
    zeroRadiusSize: 20,
    symbolLineColor: 'rgb(0,0,0)',
  },
}

export default LegendSymbol
