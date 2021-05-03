import React from 'react'
import { styled, setup } from 'goober'


setup(React.createElement)

const Name = styled('h4')`
  margin: 0px;
`
const Id = styled('h5')`
  margin: 0px;
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
 * @param { object } param.formatData - object of data formatting for different key values
 * @param { object } param.params - object of deck.gl onHover event
 * @returns { Node } - node element
 */
const tooltipNode = ({ tooltipKeys, formatData, params }) => {
  const { name, id, metricKeys, nameAccessor, idAccessor, metricAccessor, metricAliases } = tooltipKeys
  return (
    <>
      {name && nameAccessor(params)?.[name] &&
        <Name>{nameAccessor(params)[name]}</Name>
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
