// TODO - make Legend comp more customizable by size, right now it is rigid

import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import LegendItem from './legend-item'
import { LEGEND_SIZE, LEGEND_POSITION } from '../../constants'


setup(React.createElement)

const LegendContainer = styled('div')(({ num_legends, position, typography, opacity }) => ({
  ...typography,
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  cursor: num_legends > 1 ? 'pointer' : 'default',
  backgroundColor: getTailwindConfigColor('secondary-50'),
  padding: '0 .75rem .75rem',
  borderRadius: '0.15rem',
  marginBottom: '1.5rem',
  boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
  opacity,
  ...position,
}))

const LayerTitle = styled('div')`
  margin: 0.75rem auto 0 auto;
  font-weight: 700;
  font-size: 0.75rem;
`

const Legend = ({
  legendPosition,
  legendSize,
  legends,
  typography,
}) => {
  const [symbolMarginLeft, setSymbolMarginLeft] = useState(0)
  const [maxTextContainer, setMaxTextContainer] = useState(0)
  const [opacity, setOpacity] = useState(0)
  let objPosition = {}
  objPosition[legendPosition.split('-')[0]] = '.5rem'
  objPosition[legendPosition.split('-')[1]] = '.5rem'
  // const [activeLegend, setActiveLegend] = useState(0)
  // const handleLegendChange = () => setActiveLegend(o => o === legends.length - 1 ? 0 : o + 1)

  return (
    <>
      <LegendContainer
        num_legends={legends.length}
        // onClick={handleLegendChange}
        position={objPosition}
        typography={legendSize === LEGEND_SIZE.large ? typography : { ...typography, fontSize: '0.625rem' }}
        opacity={opacity}
      >
        {legends.map(({ type, layerTitle, ...legendProps }) => (
          <>
            {layerTitle && (
              <LayerTitle>
                {layerTitle}
              </LayerTitle>
            )}
            <LegendItem
              key={type}
              legendItemProps={
                {
                  type,
                  legendSize,
                  symbolMarginLeft,
                  setSymbolMarginLeft,
                  maxTextContainer,
                  setMaxTextContainer,
                  setOpacity,
                  ...legendProps,
                }
              }
            />
          </>
        ))}
      </LegendContainer>
    </>
  )
}

Legend.propTypes = {
  legendPosition: PropTypes.oneOf([...LEGEND_POSITION]),
  legendSize: PropTypes.oneOf([...Object.values(LEGEND_SIZE)]),
  legends: PropTypes.array.isRequired,
  ...typographyPropTypes,
}

Legend.defaultProps = {
  legendPosition: 'top-right',
  legendSize: LEGEND_SIZE.large,
  ...typographyDefaultProps,
}

export default Legend
