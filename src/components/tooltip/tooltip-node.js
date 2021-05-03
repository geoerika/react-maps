import React from 'react'
import { styled, setup } from 'goober'


setup(React.createElement)

const Title = styled('div')`
  margin: 0px;
  fontWeight: 700;
`
const Id = styled('div')`
  margin: 0px;
  fontWeight: 700;
`
const TooltipAttributes = styled('div')`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
`
const Keys = styled('div')`
  display: flex;
  flex-direction: column;
`
const Values = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
const tooltipNode = ({ tooltipKeys, formatData, formatTooltipTitle, params }) => {
  const { name, id, metricKeys, nameAccessor, idAccessor, metricAccessor, metricAliases } = tooltipKeys
  return (
    <>
      {name && nameAccessor(params)?.[name] &&
        <Title>{formatTooltipTitle(nameAccessor(params)[name])}</Title>
      }
      {id && idAccessor(params)?.[id] &&
        <Id>{idAccessor(params)[id]}</Id>
      }
      {metricKeys?.length && (
        <div>
          {(nameAccessor(params)?.[name] || idAccessor(params)?.[id]) && <hr></hr>}
          <TooltipAttributes>
            <Keys>
              {Object.entries(metricAccessor(params)).map(([key]) =>
                metricKeys.includes(key) &&
                <div key={key}>{metricAliases?.[key] || key}:</div>)}
            </Keys>
            <Values>
              {Object.entries(metricAccessor(params)).map(([key, value]) =>
                metricKeys.includes(key) &&
                <div
                  key={key}
                >{formatData?.[key] ? formatData?.[key](value) : value}
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
