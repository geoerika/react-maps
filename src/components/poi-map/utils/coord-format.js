// object of formatting functions for lon and lat keys in the POI map
export const formatDataPOI = {
  lon: val => Math.round(val * 100) / 100 + String.fromCharCode(176),
  lat: val => Math.round(val * 100) / 100 + String.fromCharCode(176),
}
