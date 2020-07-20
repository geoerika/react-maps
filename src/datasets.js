// NOTE: predefine dataset meta & metric keys to streamline
// grouping, filtering
// dynamic visualizations (a la Kepler), e.g. radius based on visits
export const reportWI = {
  META_FIELDS: [
    'address_city', 'address_country', 'address_label', 'address_line1', 'address_line2', 'address_postalcode', 'address_region', 'address_unit',
    'category', 'chain_id', 'date_type', 'end_date', 'start_date', 'repeat_id', 'lat', 'lon', 'name', 'poi_id', 'report_id', 'time_zone', 'type',
  ],
  DATA_FIELDS: [
    'repeat_type', 'repeat_visitors', 'repeat_visitors_hh', 'repeat_visits', 'report_id', 'unique_hh', 'unique_visitors', 'unique_visitors_dow',
    'unique_visitors_hod', 'unique_visitors_multi_visit', 'unique_visitors_single_visit', 'unique_xdevice', 'visits',
  ],
}

export const hours = new Array(24).fill(0).map((_, i) => i)
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
