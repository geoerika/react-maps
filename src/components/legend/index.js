// TODO - make Legend comp more customizable by size, right now it is rigid

import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'

import LegendItem from './legend-item'


setup(React.createElement)

const LegendContainer = styled('div')(({ num_legends, position, typography }) => ({
  ...typography,
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  cursor: num_legends > 1 ? 'pointer' : 'default',
  backgroundColor: getTailwindConfigColor('secondary-50'),
  padding: '0 .75rem .75rem',
  borderRadius: '0.2rem',
  marginBottom: '1.8rem',
  opacity: 0.9,
  ...position,
}))

const Legend = ({
  legendPosition,
  legendSize,
  legends,
  typography,
}) => {
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
        typography={legendSize === 'full' ? typography : { ...typography, fontSize: '10px' }}
      >
        {legends.map(({ type, ...legendProps }) => (
          <LegendItem
            key={type}
            legendItemProps={{ type, legendSize, ...legendProps }}
          />
        ))}
      </LegendContainer>
    </>
  )
}

Legend.propTypes = {
  legendPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  legendSize: PropTypes.oneOf(['widget', 'full']),
  legends: PropTypes.array.isRequired,
  ...typographyPropTypes,
}

Legend.defaultProps = {
  legendPosition: 'top-right',
  legendSize: 'full',
  ...typographyDefaultProps,
}

export default Legend
