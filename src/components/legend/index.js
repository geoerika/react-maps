// TODO - make Legend comp more customizable by size, right now it is rigid

import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import LegendItem from './legend-item'
import { LEGEND_SIZE, LEGEND_SIZE_LABELS, LEGEND_POSITION } from '../../constants'


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
        typography={legendSize === LEGEND_SIZE.large.label ? typography : { ...typography, fontSize: '10px' }}
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
  legendPosition: PropTypes.oneOf([...LEGEND_POSITION]),
  legendSize: PropTypes.oneOf([...LEGEND_SIZE_LABELS]),
  legends: PropTypes.array.isRequired,
  ...typographyPropTypes,
}

Legend.defaultProps = {
  legendPosition: 'top-right',
  legendSize: LEGEND_SIZE.large,
  ...typographyDefaultProps,
}

export default Legend
