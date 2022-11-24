import React from 'react'

import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { styled, setup } from 'goober'

import { getTextSize } from '../../utils/string-functions'


setup(React.createElement)

const TITLE_FONT_SIZE = 12
const FONT_SIZE = 11
const GAP = .625

const TooltipTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  min-width: ${({ width }) => width}rem;
  gap: ${GAP}rem;
`
const TooltipTitleKey = styled('div')`
  font-weight: 600;
  font-size: 0.75rem;
  color: ${getTailwindConfigColor('secondary-800')};
  min-width: ${({ width }) => width}rem;
  text-align: left;
`
const TooltipTitleValue = styled('div')`
  font-weight: 400;
  font-size: 0.75rem;
  min-width: ${({ width }) => width}rem;
  text-align: right;
`
const TooltipAttributes = styled('div')`
  display: flex;
  justify-content: space-between;
  min-width: ${({ width }) => width}rem;
  gap: ${GAP}rem;
`
const Key = styled('div')`
  font-weight: 400;
  font-size: 0.6875rem;
  color: ${getTailwindConfigColor('secondary-700')};
  min-width: ${({ width }) => width}rem;
  text-align: left;
`
const Value = styled('div')`
  font-weight: 400;
  font-size: 0.6875rem;
  color: ${getTailwindConfigColor('secondary-900')};
  min-width: ${({ width }) => width}rem;
  text-align: right;
`
const Line = styled('hr')`
  border-top: 0.0625rem solid ${getTailwindConfigColor('secondary-700')};
  margin: 0.375rem 0rem;
`

/**
 * tooltipNode - returns a node element with: name, id, and 'key: value' pairs for Tooltip component
 * @param { object } param
 * @param { object } param.tooltipKeys - object of attribute keys for Tooltip component
 * @param { function } param.formatDataKey - function to format data keys
 * @param { object } param.formatDataValue - object of data formatting for different key values
 * @param { function } param.formatTooltipTitle - function to format Tooltip title key
 * @param { function } param.formatTooltipValue - function to format Tooltip title value
 * @param { object } param.params - object of deck.gl onHover event
 * @returns { Node } - node element
 */
const tooltipNode = ({
  tooltipKeys,
  formatTooltipTitle = d => d,
  formatTooltipTitleValue = d => d,
  formatDataKey = d => d,
  formatDataValue = d => d,
  fontFamily,
  params,
}) => {
  const {
    tooltipTitle1,
    tooltipTitle2,
    metricKeys,
    tooltipTitle1Accessor = d => d,
    tooltipTitle2Accessor = d => d,
    metricAccessor = d => d,
    keyAliases,
  } = tooltipKeys

  const titleKeyMaxWidth = [tooltipTitle1, tooltipTitle2].reduce((acc, key) => {
    if (key) {
      acc = Math.max(
        acc,
        getTextSize(`${keyAliases?.[key] || formatTooltipTitle(key)}:`, 600 , TITLE_FONT_SIZE, fontFamily).width,
      )
    }
    return acc
  }, 0)

  const keyMaxWidth = Object.entries(metricAccessor(params)).reduce((acc, [key]) => {
    if (metricKeys.includes(key)) {
      acc = Math.max(
        acc,
        getTextSize(`${keyAliases?.[key] || formatDataKey(key)}:`, 400 , TITLE_FONT_SIZE, fontFamily).width,
      )
    }
    return acc
  }, titleKeyMaxWidth)

  const titleValMaxWidth = [tooltipTitle1, tooltipTitle2].reduce((acc, key) => {
    const tooltipTitleAccessor = key === tooltipTitle1 ?
      tooltipTitle1Accessor :
      tooltipTitle2Accessor
    if (key) {
      acc = Math.max(
        acc,
        getTextSize((formatTooltipTitleValue((tooltipTitleAccessor || metricAccessor)(params)?.[key])), 400 , FONT_SIZE, fontFamily).width,
      )
    }
    return acc
  }, 0)

  const valMaxWidth = Object.entries(metricAccessor(params)).reduce((acc, [key, value]) => {
    if (metricKeys.includes(key)) {
      acc = Math.max(
        acc,
        getTextSize((formatDataValue[key] ? formatDataValue[key](value) : value), 400 , FONT_SIZE, fontFamily).width,
      )
    }
    return acc
  }, titleValMaxWidth)

  return (
    <div>
      {[tooltipTitle1, tooltipTitle2].map((tooltipTitle, index) => {
        let tooltipTitleAccessor = tooltipTitle === tooltipTitle1 ?
          tooltipTitle1Accessor :
          tooltipTitle2Accessor
        return (tooltipTitle && (
          <TooltipTitle width={keyMaxWidth + valMaxWidth + GAP} key={index}>
            <TooltipTitleKey width={keyMaxWidth}>
              {keyAliases?.[tooltipTitle] || formatTooltipTitle(tooltipTitle)}:
            </TooltipTitleKey>
            <TooltipTitleValue width={valMaxWidth}>
              {formatTooltipTitleValue((tooltipTitleAccessor || metricAccessor)(params)?.[tooltipTitle])}
            </TooltipTitleValue>
          </TooltipTitle>
        ))
      })}
      {(((tooltipTitle1 && (tooltipTitle1Accessor || metricAccessor)(params)?.[tooltipTitle1]) ||
          (tooltipTitle2 && (tooltipTitle2Accessor || metricAccessor)(params)?.[tooltipTitle2])) &&
        (metricKeys?.length > 0)) && (
        <Line/>
      )}
      {metricKeys?.length > 0 && metricAccessor && (
        <>
          {Object.entries(metricAccessor(params)).map(([key, value]) =>
            (metricKeys.includes(key) && (
              <TooltipAttributes key={key} width={keyMaxWidth + valMaxWidth + GAP}>
                <Key width={keyMaxWidth}>
                  {keyAliases?.[key] || formatDataKey(key)}:
                </Key>
                <Value width={valMaxWidth}>
                  {formatDataValue[key] ? formatDataValue[key](value) : value}
                </Value>
              </TooltipAttributes>
            )),
          )}
        </>
      )} 
    </div>
  )
}

export default tooltipNode
