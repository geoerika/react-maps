import React from 'react'
import { styled, setup } from 'goober'


setup(React.createElement)

const Title = styled('div')`
  margin: 0px;
  fontWeight: 700;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const Id = styled('div')`
  margin: 0px;
  font-size: 10px;
  color: #808080;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const TooltipAttributes = styled('div')`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
`
const Keys = styled('div')`
  fontWeight: 600;
  display: flex;
  flex-direction: column;
`
const Values = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const Line = styled('hr')`
  border-top: 1px solid #6c6c6c;
`

/**
 * tooltipNode - returns a node element with: name, id, and 'key: value' pairs for Tooltip component
 * @param { object } param
 * @param { object } param.tooltipKeys - object of attribute keys for Tooltip component
 * @param { function } param.formatData - object of data formatting for different key values
 * @param { function } param.formatTooltipTitle - function to truncate Tooltip title
 * @param { object } param.params - object of deck.gl onHover event
 * @returns { Node } - node element
 */
const tooltipNode = ({
  tooltipKeys,
  formatData = d => d,
  formatTooltipTitle = d => d,
  formatPropertyLabel = d => d,
  params,
}) => {
  const { name, id, metricKeys, nameAccessor, idAccessor, metricAccessor, metricAliases } = tooltipKeys
  return (
    <>
      {name && nameAccessor?.(params)?.[name] &&
        <Title>{formatTooltipTitle(nameAccessor(params)[name])}</Title>
      }
      {id && idAccessor?.(params)?.[id] &&
        <Id>{idAccessor(params)[id]}</Id>
      }
      {metricKeys?.length > 0 && metricAccessor && (
        <div>
          {((nameAccessor?.(params)?.[name]) || (idAccessor?.(params)?.[id])) &&
            <Line/>
          }
          <TooltipAttributes>
            <Keys>
              {Object.entries(metricAccessor(params)).map(([key]) =>
                metricKeys.includes(key) &&
                <div key={key}>{metricAliases?.[key] || formatPropertyLabel(key)}:</div>)}
            </Keys>
            <Values>
              {Object.entries(metricAccessor(params)).map(([key, value]) =>
                metricKeys.includes(key) &&
                <div
                  key={key}
                >{formatData[key] ? formatData[key](value) : value}
                </div>)
              }
            </Values>
          </TooltipAttributes>
        </div>
      )} 
    </>
  )
}  

export default tooltipNode
