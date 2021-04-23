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
  ...position,
}))

const propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  legends: PropTypes.arrayOf(PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number,
    label: PropTypes.string,
  })),
}

const defaultProps = {
  position: 'top-left',
  legends: [
    {
      max: undefined,
      min: undefined,
      label: '',
    },
  ],
}

const Legend = ({ position, legends, typography }) => {
  let objPosition = {}
  objPosition[position.split('-')[0]] = '1rem'
  objPosition[position.split('-')[1]] = '1rem'
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
        {legends.map(({ max, min, label, type, ...symbolProps }) => (
          <LegendItem
            key={type}
            max={max}
            min={min}
            label={label}
            type={type}
            symbolProps={{ type, ...symbolProps }}
          />
        ))}
      </LegendContainer>
    </>
  )
}

Legend.propTypes = { ...propTypes, ...typographyPropTypes }
Legend.defaultProps = { ...defaultProps,  ...typographyDefaultProps }

export default Legend
