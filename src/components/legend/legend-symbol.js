import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import {
  LEGEND_TYPE,
  LEGEND_DOTS,
  LEGEND_RADIUS_SIZE,
  LEGEND_HEIGHT,
  LEGEND_LINE_HEIGHT,
} from '../../constants'

// import POIIconMarker from '../../shared/icons/poi-location.png'


setup(React.createElement)

const GradientContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const Gradient = styled('div')`
  height: ${({ height }) => height ? `${height}rem` : '1rem'};
  width: ${({ width }) => width ? `${width}rem` : '100%'};
  margin: auto;
  margin-top: ${({ margintop }) => margintop ? `${margintop}rem` : 'auto'};
  background-image: linear-gradient(${({ mincolor, maxcolor, fillColors }) => fillColors ?
    `to right, ${fillColors.join(', ')}`:
    `to right, ${mincolor}, ${maxcolor}`});
`

const Size = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ min, max }) => min || max ? 'space-between' : 'center'};
`

const Circle = styled('div')`
  box-sizing: border-box;
  width: ${({ size }) => `${size}rem`};
  height: ${({ size }) => `${size}rem`};
  border: 0.065rem solid ${({ linecolor }) => linecolor};
  border-radius: ${({ size }) => `${size / 2}rem`};
  background-color: ${({ color }) => color};
  margin-top: ${({ margintop }) => margintop ? `${margintop}rem` : '0rem'};
`

const HeightWrapper = styled('div')`
  border-left: ${({ pos }) => pos ? '0.065rem solid black' : ''};
  border-right: ${({ pos }) => pos ? '' : '0.065rem solid black'};
  height: 1rem;
  display: flex;
  align-items: center;
`

const Height = styled('div')`
  width: ${({ width }) => width}rem;
  height: 0.5rem;
  border-bottom: 0.065rem solid black;
  border-top: 0.065rem solid black;
  background-color: ${({ color }) => color};
`

// const Icon = styled('div')`
//   width: 1.5rem;
//   height: 1.5rem;
//   margin: auto;
//   margin-top: 0.625rem;
//   /* https://stackoverflow.com/questions/61370618/how-to-replace-color-of-png-image-using-css */
//   background: ${({ color }) => color};
//   -webkit-mask:url(${POIIconMarker}) center/contain;
//           mask:url(${POIIconMarker}) center/contain;
// `

const LegendSymbol = ({ symbolProps }) => {
  const {
    min,
    max,
    minColor,
    maxColor,
    fillColors,
    dots,
    size,
    legendSize,
    zeroRadiusSize,
    type,
    symbolLineColor,
  } = symbolProps

  if (type === LEGEND_TYPE.elevation) {
    return (
      <Size min={min} max={max}>
        <HeightWrapper pos={min !== max ? 'left' : 'center' }>
          <Height width={LEGEND_HEIGHT.left[legendSize]} color={!max && !min ? minColor : maxColor} />
        </HeightWrapper>
        {max !== min &&
          <HeightWrapper>
            <Height width={LEGEND_HEIGHT.right[legendSize]} color={maxColor} />
          </HeightWrapper>
        }
      </Size>
    )
  }

  if (type === LEGEND_TYPE.gradient) {
    // console.log('fillColors: ', fillColors)
    // console.log(' JOIN: ',  fillColors.join(','))
    const [minGradCol, maxGradCol] =  max !== min ? [minColor, maxColor] : [minColor, minColor]
    return (
      // we need to wrap Gradient into a <>, otherwise it might result in Legend disapearing from map
      <>
        <Gradient mincolor={minGradCol} maxcolor={maxGradCol} fillColors={fillColors}/>
      </>
    )
  }

  if (type === LEGEND_TYPE.size) {
    return (
      <Size min={min} max={max}>
        {max !== min ?
          new Array(dots ? dots : LEGEND_DOTS[legendSize]).fill(0).map((_, i) => (
            <Circle
              key={i}
              size={(i + 1.75) * size}
              color={maxColor}
              min={min}
              max={max}
              linecolor={symbolLineColor}
            />
          )) :
          <Circle
            size={zeroRadiusSize}
            color={max === 0 ? minColor : maxColor}
            max={max}
            linecolor={symbolLineColor}
            margintop={max === 0 ? minColor : 0.625}
          />
        }
      </Size>
    )
  }

  if (type === LEGEND_TYPE.lineWidth) {
    return (
      <GradientContainer>
        {(min !== max || (min === max && min === 0)) &&
          <Gradient
            height={LEGEND_LINE_HEIGHT.min}
            margintop={.4}
            mincolor={minColor}
            maxcolor={maxColor}
          />
        }
        {(min || max || (min === max && min !== 0)) &&
          <Gradient
            height={LEGEND_LINE_HEIGHT.max}
            margintop={min === max ? 0 : .5}
            mincolor={minColor}
            maxcolor={maxColor}
          />
        }
      </GradientContainer>
    )
  }

  // if (type === LEGEND_TYPE.icon) {
  //   return (
  //     // we need to wrap Icon into a <>, otherwise it might result in Legend disapearing from map
  //     <>
  //       <Icon
  //         color={maxColor}
  //       />
  //     </>
  //   )
  // }
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
    min: PropTypes.number,
    minColor: PropTypes.string,
    maxColor: PropTypes.string,
    fillColors: PropTypes.arrayOf(PropTypes.string),
    dots: PropTypes.number,
    size: PropTypes.number,
    zeroRadiusSize: PropTypes.number,
    symbolLineColor: PropTypes.string,
  }).isRequired,
}

LegendSymbol.defaultProps = {
  symbolProps: {
    type: 'gradient',
    fillBasedOn: '',
    max: undefined,
    min: undefined,
    fillColors: undefined,
    minColor: 'rgb(0,0,0)',
    maxColor: 'rgb(255,0,0)',
    dots: LEGEND_DOTS.lg,
    size: LEGEND_RADIUS_SIZE.default,
    zeroRadiusSize: LEGEND_RADIUS_SIZE.zero,
    symbolLineColor: 'rgb(0,0,0)',
  },
}

export default LegendSymbol
