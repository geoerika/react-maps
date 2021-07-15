import axios from 'axios'
import omit from 'lodash.omit'

import { poiCategory } from './poi-category'
import fsaFeatures from './fsa-features'
import FO from './actions'


/**
 * forwardGeocoder - searches for and returns an fsa feature
 * @param { string } query - fsa search key (ie. postal code, province..)
 * @return { object } - fsa feature
 */
export const forwardGeocoder = (query) => {
  const q = query.toLowerCase()

  return fsaFeatures.features.filter(f => f.properties.title.toLowerCase().search(q) !== -1)
    .map(f => ({
      ...f,
      place_name: f.properties.title,
      center: f.geometry.coordinates,
    }))
}

/**
 * geocoderOnResult - sets properties of fsa or other geometries found by Geocoder
 * @param { string } param
 * @param { string } param.result - the result field of an object resulting from a Geocoder search
 * @param { string } param.POIType - POI type of Geocoder result
 * @return { object } - POI feature
 */
export const geocoderOnResult = async ({ result, POIType }) => {
  const properties = {
    lat: result.center[1],
    lon: result.center[0],
    address: result.place_name,
    addressLine1: '',
    unit: '',
    postcode: '',
    city: '',
    province: '',
    country: '',
  }

  if (result.text) {
    properties.addressLine1 = result.address ? `${result.address} ${result.text}`
      : result.text

    properties.name = result.text
  }

  if (result.place_name) {
    properties.name = result.place_name
  }

  const placeInfo = {}
  const contextData = [{
    id: result.id,
    text: result.text,
    short_code: result.properties.short_code,
  }, ...(result.context ? result.context : [])]

  contextData.forEach(({ id, text, short_code: shortCode }) => {
    if (id.includes('postcode')) {
      properties.postcode = text
      placeInfo.postcode = text
    }
    if (id.includes('place')) {
      properties.city = text
      placeInfo.place = text
    }
    if (id.includes('region')) {
      properties.province = text
      placeInfo.region = shortCode.toUpperCase()
    }
    if (id.includes('country')) {
      properties.country = text
      placeInfo.country = shortCode.toUpperCase()
    }
  })

  if (POIType === 1) {
    const [placeType] = result.place_type

    placeInfo.placeType = placeType
    // auto insert place polygon and type
    if (['country', 'region', 'place', 'postcode'].includes(placeType)) {
      if (placeInfo.region) {
        placeInfo.region = placeInfo.region.replace(`${placeInfo.country}-`, '')
      }

      properties.category = poiCategory.find(val =>
        (val.key === placeType) ||
        (val.key === 'fsa' && placeType === 'postcode' && placeInfo.postcode.length === 3)).value

      properties.businessType = 3
      const featureGeometry = await getPlaceGeo(FOApi)({ data: placeInfo })
      if (featureGeometry?.geometry?.type) {
        return {
          ...featureGeometry,
          properties,
        }
      }
    }
  }
  return {
    ...result,
    properties,
  }
}

const jwt = window.localStorage.getItem('auth_jwt')

// create instance of FO object with our axios configuration
export const FOApi = FO(axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': jwt },
}))

/**
 * getPlaceGeo - returns the full geometry of a polygon/multipolygon POI
 * @param { string } param
 * @param { string } param.data - object properties needed to retrieve geometry of fsa polygon
 * @return { object } - polygon POI feature
 */
export const getPlaceGeo = (api) => async ({ data }) => {
  try {
    const placeGeometry = await api.getGeoPlacePolygon(data)
    const { geometry } = placeGeometry[0]
    return {
      type: 'Feature',
      geometry,
    }
  } catch (error) {
    console.error(error)
  }
}

/*
address_city: "Mill Bay"
address_country: "CA"
address_label: "855 Shawnigan Mill Bay Road,MillBay,BC,V0R 2P2,Canada"
address_line1: "855 Shawnigan Mill Bay Road"
address_line2: null
address_postalcode: "V0R2P2"
address_region: "BC"
address_unit: null
category: 8
chain_id: 4
date_type: 2
end_date: "2018-07-14T00:00:00.000Z"
has_aoi: false
lat: 48.6578541
lon: -123.5621958
name: "Salvation Army"
outlier: false
poi_id: 23201
repeat_type: 4
repeat_visitors: 3
repeat_visitors_hh: null
repeat_visits: null
report_id: 4
start_date: "2018-07-09T00:00:00.000Z"
time_zone: "America/Vancouver"
type: 2
unique_hh: null
unique_visitors: 6
unique_visitors_dow: null
unique_visitors_hod: null
unique_visitors_multi_visit: 0
unique_visitors_single_visit: 6
unique_xdevice: 0
visits: 6
visits_dow: {Wed: 0, Sun: 0, Thu: 0, Tue: 0, Mon: 6, …}
visits_hod: {0: 0, 1: 0, 2: 0, 3: 0
*/

// TODO: expose filtering by meta_field values
// TODO: expose grouping by meta_fields (take geometric centre of points?) -> sum, avg, min, max of metrics
// TODO: expose filtering by data_field values
// TODO: date filters (within report)
// TODO: date filters (between report durations)

export const transformReportWi = report => report.map(poi_data => ({
  ...omit(poi_data, 'visits_dow', 'visits_hod'),
  start_date: new Date(poi_data.start_date),
  // [day]: visitCount
  ...(poi_data.visits_dow || {}),
  // [hour]: visitCount
  ...(poi_data.visits_hod || {}),
}))

export const genUniqueDateKey = o => `${o.date_type}_//_${o.start_date}_//_${o.end_date}`
