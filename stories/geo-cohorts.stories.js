/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { GeoCohortMap } from '../src'
import { getCursor } from '../src/utils'
import geoCohortJson from './data/geo-cohorts.json'

import { getPlaceGeo, FOApi } from './poi-manage'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN

storiesOf('Geo-Cohort Map', module)
  .add('GeoCohortMap - basic', () => {
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
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - colour fill based on impressions', () => {
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
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          fillBasedOn={'Imps'}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
  .add('GeoCohortMap - elevation based on impressions', () => {
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
        <GeoCohortMap
          reportData={geoCohortData}
          getCursor={getCursor()}
          elevationBasedOn={'Revenue'}
          pitch={45}
          mapboxApiAccessToken={mapboxApiAccessToken}
        />
    )
  })
