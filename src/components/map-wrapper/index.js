import React from 'react'

import styled from 'styled-components'
import { AutoSizer } from 'react-virtualized'

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: 'absolute';
`

const MapWrapper = Map => ({
  ...mapProps
}) => (
  <MapContainer>
    <AutoSizer>
      {({ height, width }) => (
        <Map
          height={ height }
          width={ width }
          { ...mapProps }
        />
      )}
    </AutoSizer>
  </MapContainer>
)

export default MapWrapper
