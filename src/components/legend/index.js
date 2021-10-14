import React from 'react'
import PropTypes from 'prop-types'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import { styled, setup } from 'goober'

import LegendItem from './legend-item'


setup(React.createElement)

const LegendContainer = styled('div')(({ num_legends, position, typography }) => ({
  ...typography,
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  cursor: num_legends > 1 ? 'pointer' : 'default',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '0 .75rem .75rem',
  borderRadius: '0.2rem',
  marginBottom: '.5rem',
  ...position,
}))

const Legend = ({
  position,
  legends,
  typography,
}) => {
  let objPosition = {}
  objPosition[position.split('-')[0]] = '.5rem'
  objPosition[position.split('-')[1]] = '.5rem'
  // const [activeLegend, setActiveLegend] = useState(0)
  // const handleLegendChange = () => setActiveLegend(o => o === legends.length - 1 ? 0 : o + 1)

  return (
    <>
      <LegendContainer
        num_legends={legends.length}
        // onClick={handleLegendChange}
        position={objPosition}
        typography={typography}
      >
        {legends.map(({ type, ...legendProps }) => (
          <LegendItem
            key={type}
            legendItemProps={{
              type,
              ...legendProps,
            }}
          />
        ))}
      </LegendContainer>
    </>
  )
}

Legend.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  legends: PropTypes.array.isRequired,
  ...typographyPropTypes,
}

Legend.defaultProps = {
  position: 'top-left',
  ...typographyDefaultProps,
}

export default Legend
