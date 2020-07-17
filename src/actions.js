import { transformReportWi } from './transforms'

// requires axios-like signature with JWT provided
const FO = (api) => ({
  getReportWi: async ({ report_id, layer_id, map_id, params }) => {
    const url = `/report/${report_id}?layerID=${layer_id}&mapID=${map_id}`
    // duration, durations
    const { data: { report } } = await api.get(url, { params })
    return transformReportWi(report)
  },

})

export default FO
