import omit from 'lodash.omit'
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
