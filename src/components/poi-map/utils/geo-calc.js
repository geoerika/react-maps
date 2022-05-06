import { point } from '@turf/helpers'
import tCentroid from '@turf/centroid'
import tBBox from '@turf/bbox'
import tDistance from '@turf/distance'


/**
 * getCircleRadiusCentroid - calculates the radius and centroid of a circle / polygon
 * @param { object } polygon - GeoJSON polygon object
 * @return { object } - the values of the circle's radius and centroid coordinates
 */
export const getCircleRadiusCentroid = ({ polygon }) => {
  polygon = {
    ...polygon,
    type: 'Feature',
  }
  const centroid = tCentroid(polygon)
  const bound = tBBox(polygon)
  let radius = tDistance(centroid, point(([(bound[0] + bound[2]) / 2, bound[3]])))
  // return radius in meters
  let coordinates = centroid.geometry.coordinates
  radius = Math.round(radius * 1000000) / 1000
  return { radius, coordinates }
}
