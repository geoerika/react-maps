import axios from 'axios'

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
 * geocoderOnResult - searches for and returns an fsa feature
 * @param { string } param
 * @param { string } param.result - the result field of an object resulting from a geocoder search
 * @param { string } param.POIType - POI type of geocoder result
 * @return { object } - POI feature
 */
export const geocoderOnResult = async (result, POIType) => {
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
      const featureGeometry = await getPlaceGeo(FOApi)(placeInfo, properties)
      if (featureGeometry?.geometry?.type) {
        return featureGeometry
      }
    }
  }
  return {
    type: result.type,
    geometry: result.geometry,
    properties,
  }
}

// create instance of FO object with our axios configuration
const FOApi = FO(axios.create({
  baseURL: `${process.env.API_HOST}/${process.env.API_STAGE}`,
  headers: { 'eq-api-jwt': process.env.JWT },
}))

/**
 * getPlaceGeo - returns the full geometry of a polygon/multipolygon POI
 * @param { string } param
 * @param { string } param.result - the result field of an object resulting from a geocoder search
 * @param { string } param.POIType - POI type of geocoder result
 * @return { object } - POI feature
 */
const getPlaceGeo = (api) => async (data, properties) => {
  try {
    const placeGeometry = await api.getGeoPlacePolygon(data)
    const { geometry } = placeGeometry[0]

    return {
      type: 'Feature',
      geometry,
      properties,
    }
  } catch (error) {
    console.error(error)
  }
}
