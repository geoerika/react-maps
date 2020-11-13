/* eslint-disable react/prop-types */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { POIMap, POIMapActivePOI } from '../src'
import POIsRadii from './data/pois-radii'
import POIsRadiiTo from './data/pois-radiito'
import POIsPolygonsVanData from './data/pois-polygons-van'
import { styled, setup } from 'goober'


setup(React.createElement)

const Text = styled('div')`
  color: red;
`

// create GeoJSON format for polygon data
const POIsPolygonsVan = POIsPolygonsVanData.map((polygon) =>
  ({ ...polygon, geometry: JSON.parse(polygon.properties.polygon_json) }))

storiesOf('POI Map', module)
  .add('Point POIs - icons with POIIcon layer', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['POIIcon'] }/>
  ))
  .add('Point POIs - clusters with POICluster layer', () => (
    <POIMap POIData={ POIsRadii } layerArray={ ['POICluster'] }/>
  ))
  .add('Point POIs - radii with POIGeoJson layer', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['POIGeoJson'] }/>
  ))
  .add('Point POIs - radii & icons', () => (
    <POIMap POIData={ POIsRadiiTo } layerArray={ ['POIGeoJson', 'POIIcon'] }/>
  ))
  .add('Point POIs - one POI to check zoom', () => (
    <POIMap POIData={ [POIsRadiiTo[0]] } layerArray={ ['POIGeoJson', 'POIIcon'] }/>
  ))
  .add('Point POIs - POIManage: activePOI and radius change', () => (
    <POIMapActivePOI POIData={ POIsRadiiTo }/>
  ))
  .add('Polygon POIs - POIPolygon layer', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['POIPolygon'] }/>
  ))
  .add('Polygon POIs - POIGeoJson layer', () => (
    <POIMap POIData={ POIsPolygonsVan } layerArray={ ['POIGeoJson'] }/>
  ))
  .add('Edit Point POIs - POIEditDraw layer', () => (
    <div>
      <Text>Click feature to start editing!</Text>
      <POIMap
        POIData={ [POIsRadiiTo[0]] }
        layerArray={ ['POIEditDraw'] }
        mode={ 'poi-edit' }
        controller={{ doubleClickZoom: false }}
      />
    </div>
  ))
  .add('Edit Radius POIs - POIEditDraw layer', () => (
    <div>
      <Text>Click feature to start editing!</Text>
      <POIMap
        activePOI={ POIsRadiiTo[0] }
        layerArray={ ['POIEditDraw'] }
        mode={ 'poi-point-radius-edit' }
        controller={{ doubleClickZoom: false }}
      />
    </div>
  ))
  .add('Edit Polygon POIs - POIEditDraw layer', () => (
    <div>
      <Text>Click feature to start editing!</Text>
      <POIMap
        POIData={ [POIsPolygonsVan[0]] }
        layerArray={ ['POIEditDraw'] }
        mode={ 'poi-edit' }
        controller={{ doubleClickZoom: false }}
      />
    </div>
  ))
  .add('Draw Point POIs - POIEditDraw layer', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'point-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
  .add('Draw Polygon POIs - POIEditDraw layer', () => (
    <POIMap 
      POIData={ [] }
      layerArray={ ['POIEditDraw'] }
      mode={ 'polygon-draw'}
      controller={{ doubleClickZoom: false }}
    />
  ))
