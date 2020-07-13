import { omit, pick } from 'lodash'
import moment from 'moment'
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

const META_FIELDS = [
  'address_city', 'address_country', 'address_label', 'address_line1', 'address_line2', 'address_postalcode', 'address_region', 'address_unit',
  'category', 'chain_id', 'date_type', 'end_date', 'start_date', 'repeat_id', 'lat', 'lon', 'name', 'poi_id', 'report_id', 'time_zone', 'type', 
]
export const transformReportWi = report => report.map(poi_data => {
  // TODO process HOD and DOW into separate rows, possibly adding a new dataset entirely
  return { ...omit(poi_data, 'visits_dow', 'visits_hod'), start_date: moment(poi_data.start_date).format('YYYY-MM-DD HH:mm Z') }
})
