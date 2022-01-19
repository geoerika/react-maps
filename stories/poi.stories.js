import React, { useState } from 'react'
import { Authenticated } from '@eqworks/common-login'

import { Button } from '@eqworks/lumen-labs'

import { POIMap } from '../src'

import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radii-to'
import POIsRadii6 from './data/pois-radii-6.json'
import POIsPolygonsVanData from './data/pois-polygons-van'
import POIsPolygonTorontoData from './data/pois-polygon-toronto.json'

import { forwardGeocoder, geocoderOnResult } from './locus'


const mapboxApiAccessToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN

// create GeoJSON format for polygon data
const POIsPolygonsVan = POIsPolygonsVanData.map((polygon) =>
  ({ ...polygon, geometry: JSON.parse(polygon.properties.polygon_json) }))
const POIsPolygonToronto = POIsPolygonTorontoData.map((polygon) =>
  ({ ...polygon, geometry: JSON.parse(polygon.properties.polygon_json) }))

export default {
  title: 'POI Map',
  component: POIMap,
}

const Template = (args) => <POIMap {...args} />

const displayArgs = {
  mode: 'display',
  mapboxApiAccessToken: mapboxApiAccessToken,
}

export const POIClusters = Template.bind({})
POIClusters.args = {
  POIData: POIsRadii,
  cluster: true,
  ...displayArgs,
}
POIClusters.storyName = 'Point POIs - using clusters with POICluster, POIIcon, & POIGeoJson layers'

export const RadiiAndIcons = Template.bind({})
RadiiAndIcons.args = { POIData: POIsRadiiTo, ...displayArgs }
RadiiAndIcons.storyName = 'Point POIs - radii & icons with POIIcon & POIGeoJson layers - no clusters'

export const PointPOIOne = Template.bind({})
PointPOIOne.args = { POIData: [POIsRadiiTo[0]], ...displayArgs }
PointPOIOne.storyName = 'Point POIs - one POI to check zoom'

export const PointPOIListsWithLess10Pois = Template.bind({})
PointPOIListsWithLess10Pois.args = { POIData: POIsRadii6, ...displayArgs }
PointPOIListsWithLess10Pois.storyName = 'Point POIs - check icon size and zoom for lists with < 10 POIs'

export const PointPOIActivePOIAndRadiusChange = () => {
  const [activePOI, setActivePOI] = useState(null)

  const changeRadius = () => {
    let radius = 100
    let newActivePOI = {
      geometry: activePOI.geometry,
      properties: {
        ...activePOI.properties,
        radius,
      },
    }
    setActivePOI(newActivePOI)
  }
  return (
    <div>
      <p style={{ color: 'red' }}>FIRST: select a POI on the map!</p>
      <Button
        variant='outlined'
        size='md'
        onClick={changeRadius}
      >Change Radius
      </Button>
      {POIsRadiiTo.length > 0 &&
        <POIMap
          POIData={POIsRadiiTo}
          activePOI={activePOI}
          setActivePOI={setActivePOI}
          { ...displayArgs }
        />
      }
    </div>
  )
}
PointPOIActivePOIAndRadiusChange.storyName = 'Point POIs - POIManage: activePOI and radius change'

export const PolygonPOI = Template.bind({})
PolygonPOI.args = { POIData: POIsPolygonsVan, ...displayArgs }
PolygonPOI.storyName = 'Polygon POIs - POIGeoJson layer'

const editArgs = {
  ...displayArgs,
  mode: 'edit',
  controller: { doubleClickZoom: false },
}

export const EditRadius = Template.bind({})
EditRadius.args = { activePOI: POIsRadiiTo[0], ...editArgs }
EditRadius.storyName = 'Edit Radius POIs - POIEditDraw layer'

export const EditPolygon = Template.bind({})
EditPolygon.args = { activePOI: POIsPolygonToronto[0], ...editArgs }
EditPolygon.storyName = 'Edit Polygon POIs - POIEditDraw layer'

const drawArgs = {
  controller: { doubleClickZoom: false },
  mapboxApiAccessToken: mapboxApiAccessToken,
}

export const DrawPoint = Template.bind({})
DrawPoint.args = { mode: 'point-draw', ...drawArgs }
DrawPoint.storyName = 'Draw Point POIs - POIEditDraw layer'

export const DrawPolygon = Template.bind({})
DrawPolygon.args = { mode: 'polygon-draw', ...drawArgs }
DrawPolygon.storyName = 'Draw Polygon POIs - POIEditDraw layer'

export const CreatePointPOI = () => (
  <Authenticated product='locus'>
    <POIMap
      {...drawArgs}
      mode={'create-point'}
      forwardGeocoder={forwardGeocoder}
      geocoderOnResult={geocoderOnResult}
    />
  </Authenticated>
)
CreatePointPOI.parameters = { layout: 'fullscreen' }

export const CreatePolygonPOI = () => (
  <Authenticated product='locus'>
    <POIMap
      {...drawArgs}
      mode={'create-polygon'}
      forwardGeocoder={forwardGeocoder}
      geocoderOnResult={geocoderOnResult}
    />
  </Authenticated>
)
CreatePolygonPOI.parameters = { layout: 'fullscreen' }
