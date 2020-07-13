import { transformReportWi } from './transforms'
// same signature as poi-manage
// requires axios-like signature with JWT provided
const FO = (api) => ({
  getReportWi: async ({ params }) => {
    const url = '/report/4?layerID=1&mapID=145'
    // duration, durations
    const { data: { report } } = await api.get(url, { params })
    return transformReportWi(report)
  },

})

export default FO
