// TODO - make Legend comp more customizable by size, right now it is rigid

import React, { useState, useMemo, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import { typographyPropTypes, typographyDefaultProps } from '../../shared/map-props'
import LegendItem from './legend-item'
import { getCanvasFont, getTextWidth } from './utils'
import {
  LEGEND_SIZE,
  LEGEND_POSITION,
  LEGEND_SYMBOL_WIDTH,
  LEGEND_LAYER_MAX_WIDTH,
  FONT_SIZE,
} from '../../constants'


setup(React.createElement)

const LegendContainer = styled('div')(({ num_legends, position, typography, opacity }) => ({
  ...typography,
  display: 'flex',
  flexDirection: 'column',
  rowGap: '.375rem',
  position: 'absolute',
  cursor: num_legends > 1 ? 'pointer' : 'default',
  backgroundColor: getTailwindConfigColor('secondary-50'),
  padding: '.75rem .75rem .8125rem .75rem',
  borderRadius: '0.15rem',
  marginBottom: '1.5rem',
  boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
  opacity,
  ...position,
}))

const LayerTitle = styled('div', forwardRef)`
  font-weight: 700;
  font-size: 0.75rem;
  text-align: center;
  max-width: ${({ maxwidth }) => maxwidth}rem;
  margin-bottom: 0.275rem;
  margin-left: ${({ titleleftmargin }) => titleleftmargin}rem;
  overflow-wrap: break-word;
  width: fit-content;
`

const Legend = ({
  legendPosition,
  legendSize,
  legends,
  typography,
}) => {
  // the largest offset / margin on the left side of the legend symbol due to underneath text width
  const [symbolMarginLeft, setSymbolMarginLeft] = useState(0)
  // the largest offset on the right side of the legend symbol due to underneath text width
  const [rightTextOffset, setRightTextOffset] = useState(0)
  const [opacity, setOpacity] = useState(0)

  const layerTitleRef = useRef(null)

  let objPosition = {}
  objPosition[legendPosition.split('-')[0]] = '.5rem'
  objPosition[legendPosition.split('-')[1]] = '.5rem'
  // const [activeLegend, setActiveLegend] = useState(0)
  // const handleLegendChange = () => setActiveLegend(o => o === legends.length - 1 ? 0 : o + 1)

  let font = ''
  if (layerTitleRef.current) {
    font = getCanvasFont(layerTitleRef.current)
  }

  const maxLegendWidth = useMemo(() =>
    Math.max(
      LEGEND_LAYER_MAX_WIDTH,
      symbolMarginLeft + LEGEND_SYMBOL_WIDTH[legendSize] + rightTextOffset,
    )
  , [symbolMarginLeft, legendSize, rightTextOffset])

  const maxLayerTitleWidth = useMemo(() =>
    legends.reduce((acc, { layerTitle }) =>
      Math.max(acc, Math.min(maxLegendWidth, getTextWidth(layerTitle, font) / FONT_SIZE)), 0)
  , [legends, font, maxLegendWidth])

  const legendItemPadding = useMemo(() => symbolMarginLeft <= (maxLayerTitleWidth - LEGEND_SYMBOL_WIDTH[legendSize]) / 2 ?
    (maxLayerTitleWidth - LEGEND_SYMBOL_WIDTH[legendSize]) / 2 - symbolMarginLeft :
    0
  ,[legendSize, maxLayerTitleWidth, symbolMarginLeft])

  return (
    <LegendContainer
      id='legend-container'
      num_legends={legends.length}
      // onClick={handleLegendChange}
      position={objPosition}
      typography={legendSize === LEGEND_SIZE.large ? typography : { ...typography, fontSize: '0.625rem' }}
      opacity={opacity}
      maxwidth={maxLegendWidth}
    >
      {legends.map(({ type, layerTitle, ...legendProps }, index) => {
        const layerTitleWidth = Math.min(maxLegendWidth, getTextWidth(layerTitle, font) / FONT_SIZE)
        let layerTitleLeftMargin = 0
        if (symbolMarginLeft + legendItemPadding > (layerTitleWidth - LEGEND_SYMBOL_WIDTH[legendSize]) / 2) {
          layerTitleLeftMargin = symbolMarginLeft + legendItemPadding - layerTitleWidth / 2 +
            LEGEND_SYMBOL_WIDTH[legendSize] / 2
        }
        return (
          <div key={index}>
            {layerTitle && (
              <LayerTitle
                ref={layerTitleRef}
                titleleftmargin={layerTitleLeftMargin}
                maxwidth={maxLegendWidth}
              >
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
                  rightTextOffset,
                  setRightTextOffset,
                  setOpacity,
                  ...legendProps,
                  ...{ paddingLeft: legendItemPadding },
                }
              }
            />
          </div>
        )})}
    </LegendContainer>
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
