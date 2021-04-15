import React from 'react'
import { styled, setup } from 'goober'


setup(React.createElement)

const Name = styled('h4')`
  margin: 0px;
`
const Id = styled('h5')`
  margin: 0px;
`
const Key = styled('p')`
  display: inline;
  margin-right: 10px;
`
const Value = styled('span')`
  float: right;
`

/**
 * tooltipNode - returns a node element with: name, id, and 'key: value' pairs for Tooltip component
 * @param { object } param
 * @param { object } param.tooltipKeys - object of attribute keys for Tooltip component
 * @param { object } param.params - object of deck.gl onHover event
 * @returns { Node } - node element
 */
const tooltipNode = ({ tooltipKeys, params }) => {
  const { name, id, metricKeys, nameAccessor, idAccessor, metricAccessor } = tooltipKeys
  return (
    <>
      {name && <Name>{nameAccessor(params)[name]}</Name>}
      {id && <Id>{idAccessor(params)[id]}</Id>}
      {metricKeys.length && (
        <div>
          <hr></hr>
          {Object.entries(metricAccessor(params)).map(([key, value]) => (
            <div key={key}>
              {metricKeys.includes(key) && (
                <div>
                  <Key>{`${key}:`}</Key>
                  <Value>{value}</Value>
                </div>
              )}
            </div>
          ))}
        </div>
      )} 
    </>
  )
}  

export default tooltipNode
