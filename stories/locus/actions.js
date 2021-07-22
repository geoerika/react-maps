// requires axios-like signature with JWT provided
import { transformReportWi } from './index'
import { genUniqueDateKey } from './index'


const parseDuration = d => ({ startDate: d.start_date, endDate: d.endDate, dateType: d.date_type })

const FO = (api) => ({
  // gets geometry for polygon features
  getGeoPlacePolygon: (params) => 
    api.get('/poi/geo-place', { params }).then(({ data }) => data || {}),
  getReportWi: async ({ report_id, layer_id, map_id, currentDuration, params }) => {
    const { data: { report, duration, durations } } = await api.get(`/report/${report_id}`, {
      params: {
        ...params,
        layerID: layer_id,
        mapID: map_id,
        ...(currentDuration ? parseDuration(currentDuration) : {}),
      },
    })

    return {
      data: transformReportWi(report),
      duration: { ...duration, key: genUniqueDateKey(duration) },
      // TODO review end-to-end use of durations, seems like duplicated effort
      durations: Object.values(durations).reduce((flat, dateTypeRanges) => (
        [
          ...flat,
          ...dateTypeRanges.map(o => ({ ...o, key: genUniqueDateKey(o) })),
        ]
      ), []),
    }
  },
})

export default FO
