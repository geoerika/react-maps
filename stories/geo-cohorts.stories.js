/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { GeoCohortMap } from '../src'
import { getCursor } from '../src/utils'
import geoCohortJson from './data/geo-cohorts.json'
import geoCohortJsonZero from './data/geo-cohorts-zero.json'

import { getPlaceGeo, FOApi } from './poi-manage'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

const truncate = (fullStr, strLen, separator = ' ... ') => {
  if (fullStr.length <= strLen) {
    return fullStr
  }
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return fullStr.substr(0, frontChars)
           + separator
           + fullStr.substr(fullStr.length - backChars)
}

const formatData = {
  Revenue: d => '$' + d,
}

const useGeoCohortData = () => {
  const [geoCohortData, setGeoCohortData] = useState([])
  useEffect(() => {
    const getFSAsGeometry = async (dataArray) => {
      let response = []
      await Promise.all(dataArray.map(async elem => {
        try {
          await getPlaceGeo(FOApi)({ data: {
            placeType: 'postcode',
            country: 'CA',
            postcode: elem._id.GeoCohortItem,
          } }).then(result => {
            response.push({
              ...result,
              ...elem,
              ...elem._id,
            })
          })
        } catch (error) {
          console.error(error)
        }
      }))
      setGeoCohortData(response)
    }
    getFSAsGeometry(geoCohortJson)
  }, [])
  return geoCohortData
}

storiesOf('Geo-Cohort Map', module)
  .add('GeoCohortMap - basic', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - colour fill based on Impressions', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - elevation based on Revenue', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          elevationBasedOn={'Revenue'}
          pitch={45}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - tooltip', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          showTooltip={true}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - custom tootltipKeys for tooltip', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          showTooltip={true}
          tooltipKeys={{
            metricKeys: ['Imps', 'Clicks', 'Bids', 'Revenue'],
            metricAliases: {
              Imps: 'Impressions',
              Revenue: 'Spend',
            },
          }}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - show legend for data-based colour fill', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          showTooltip={true}
          showLegend={true}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - show legend for data-based elevation', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          elevationBasedOn={'Revenue'}
          pitch={45}
          showTooltip={true}
          showLegend={true}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - data-based colour fill and elevation with tooltip, custom legend labels', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          elevationBasedOn={'Revenue'}
          showTooltip={true}
          tooltipKeys={{
            metricAliases: {
              Imps: 'Impressions',
              Revenue: 'Spend',
            },
          }}
          showLegend={true}
          pitch={45}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - zero max and min values for colorFill and elevation legend', () => {
    const [geoCohortDataZero, setGeoCohortDataZero] = useState([])
    useEffect(() => {
      const getFSAsGeometry = async (dataArray) => {
        let response = []
        await Promise.all(dataArray.map(async elem => {
          try {
            await getPlaceGeo(FOApi)({ data: {
              placeType: 'postcode',
              country: 'CA',
              postcode: elem._id.GeoCohortItem,
            } }).then(result => {
              response.push({
                ...result,
                ...elem,
                ...elem._id,
              })
            })
          } catch (error) {
            console.error(error)
          }
        }))
        setGeoCohortDataZero(response)
      }
      getFSAsGeometry(geoCohortJsonZero)
    }, [])
    return (
      geoCohortDataZero.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortDataZero}
          getCursor={getCursor()}
          fillBasedOn={'Bids'}
          elevationBasedOn={'Clicks'}
          showTooltip={true}
          tooltipKeys={{
            metricAliases: {
              Imps: 'Impressions',
              Revenue: 'Spend',
            },
          }}
          showLegend={true}
          pitch={45}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - truncate legend title', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          showTooltip={true}
          tooltipKeys={{
            metricAliases: {
              Imps: 'Impressions',
              Revenue: 'Spend',
            },
          }}
          showLegend={true}
          truncateLabel={(label) => truncate(label, 10)}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - format data values', () => {
    const geoCohortData = useGeoCohortData()
    return (
      geoCohortData.length > 0 &&
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Revenue'}
          showTooltip={true}
          tooltipKeys={{
            metricAliases: {
              Imps: 'Impressions',
              Revenue: 'Spend',
            },
          }}
          showLegend={true}
          formatData={formatData}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
