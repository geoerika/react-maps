import { transformReportWi } from './transforms'


const parseUrlParams = d => `&startDate=${d.start_date}&endDate=${d.end_date}&dateType=${d.date_type}`
// requires axios-like signature with JWT provided
const FO = (api) => ({
  getReportWi: async ({ report_id, layer_id, map_id, currentDuration, params }) => {
    const url = `/report/${report_id}?layerID=${layer_id}&mapID=${map_id}${currentDuration ? parseUrlParams(currentDuration) : ''}`
    // duration, durations
    const { data: { report, durations } } = await api.get(url, { params })
    return {
      data: transformReportWi(report),
      durations: Object.values(durations).reduce((flat, dateTypeRanges) => (
        [
          ...flat,
          ...dateTypeRanges.map(o => ({ ...o, key: `${o.date_type}_//_${o.start_date}_//_${o.end_date}` }))
        ]
      )),
    }
  },

})

export default FO
