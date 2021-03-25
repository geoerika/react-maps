// requires axios-like signature with JWT provided
const FO = (api) => ({
  // gets geometry for polygon features
  getGeoPlacePolygon: (params) => 
    api.get('/poi/geo-place', { params }).then(({ data }) => data || {}),
})

export default FO
