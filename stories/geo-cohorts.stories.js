/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { GeoCohortsMap } from '../src'
import { getCursor } from '../src/utils'
import geoCohortJson from './data/geo-cohorts.json'

import { getPlaceGeo, FOApi } from './poi-manage'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

storiesOf('Geo Cohorts Map', module)
  .add('VWI - basic', () => {
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
                properties: elem,
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
    return (
      geoCohortData.length > 0 &&
        <GeoCohortsMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
