/* eslint-disable react/prop-types */
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'

import keplerGLReducer from 'kepler.gl/reducers'
import { taskMiddleware } from 'react-palm/tasks'
import { AutoSizer } from 'react-virtualized'

const reducer = combineReducers({
  keplerGl: keplerGLReducer, // default reducer getter key is keplerGl
  // ...other reducers
})
const store = createStore(reducer, {}, applyMiddleware(taskMiddleware))

import Map from '../src'

export default {
  title: 'Map',
  component: Map,
  decorators: [
    (storyFn) => (
      <Provider store={store}>
        <div style={{ width: '100%', height: '100vh' }}>
          <AutoSizer>
            {({ height, width }) => storyFn({ height, width })}
          </AutoSizer>
        </div>
      </Provider>
    ),
  ],
}

export const normal = ({ height, width }) => (
  <Map
    id='normal'
    width={width}
    mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
    height={height}
    appName='Snoke Maps'
  />
)
