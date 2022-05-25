import React from 'react'
import { styled, setup } from 'goober'


setup(React.createElement)

const POIDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const POIIdKey = styled('div')`
  font-weight: 700;
  margin-right: 0.625rem;
`
const POIIdValue = styled('div')`
`
const Title = styled('div')`
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const Id = styled('div')`
  font-size: 0.625rem;
  color: #808080;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const TooltipAttributes = styled('div')`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.625rem;
  align-items: flex-end;
`
const Keys = styled('div')`
  font-weight: 600;
`
const Values = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const Line = styled('hr')`
  border-top: 0.065rem solid #6c6c6c;
  margin: 0.2rem;
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
  const {
    name,
    id,
    sourcePOIId,
    targetPOIId,
    metricKeys,
    nameAccessor = d => d,
    idAccessor = d => d,
    sourcePOIIdAccessor = d => d,
    targetPOIIdAccessor = d => d,
    metricAccessor = d => d,
    metricAliases,
  } = tooltipKeys

  return (
    <>
      {name && nameAccessor?.(params)?.[name] &&
        <Title>
          {formatTooltipTitle(nameAccessor(params)[name])}
        </Title>
      }
      {id && idAccessor?.(params)?.[id] &&
        <Id>
          {idAccessor(params)[id]}
        </Id>
      }
      {sourcePOIId && sourcePOIIdAccessor(params)?.[sourcePOIId] && (
        <POIDiv>
          <POIIdKey>
            Source POI ID:
          </POIIdKey>
          <POIIdValue>
            {sourcePOIIdAccessor(params)?.[sourcePOIId]}
          </POIIdValue>
        </POIDiv>
      )}
      {targetPOIId && targetPOIIdAccessor(params)?.[targetPOIId] && (
        <POIDiv>
          <POIIdKey>
            Target POI ID:
          </POIIdKey>
          <POIIdValue>
            {targetPOIIdAccessor(params)?.[targetPOIId]}
          </POIIdValue>
        </POIDiv>
      )}
      {metricKeys?.length > 0 && metricAccessor && (
        <div>
          {(nameAccessor?.(params)?.[name] ||
            idAccessor?.(params)?.[id] ||
            sourcePOIIdAccessor(params)?.[sourcePOIId] ||
            targetPOIIdAccessor(params)?.[targetPOIId]
          ) &&
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
