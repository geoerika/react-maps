/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { styled, setup } from 'goober'

import Loader from '../src/components/loader'


setup(React.createElement)

const Container = styled('div')`
  padding: 1rem;
  border: 1px dashed black;
`

export default {
  component: Loader,
  title: 'Loader',
}

export const JSONLoader = () => {
  const [data, setData] = useState()
  const setJSONData = (json) => {
    try {
      setData(JSON.parse(json))
    } catch (error) {
      console.error(error)
      setData(error)
    }
  }

  return (
    <>
      <Container>
        <Loader setData={setJSONData} prompt={'Drag JSON file here'} />
      </Container>
      {data && (
        <Container>
          <pre>
            {data instanceof Error ? data.toString() : JSON.stringify(data, null, 2)}
          </pre>
        </Container>
      )}
    </>
  )
}

export const textLoader = () => {
  const [data, setData] = useState()

  return (
    <>
      <Container>
        <Loader setData={setData} prompt={'Drag non-binary file here'} />
      </Container>
      {data && (<pre>{data}</pre>)}
    </>
  )
}

export const binaryLoader = () => {
  const [data, setData] = useState()
  const setBinData = (bin) => {
    const d = new TextDecoder('utf-8')
    setData(d.decode(bin))
  }

  return (
    <>
      <Container>
        <Loader setData={setBinData} prompt={'Drag binary file here'} mode='binary' />
      </Container>
      {data && (<pre>{data}</pre>)}
    </>
  )
}

export const promptChildren = () => (
  <Container>
    <Loader setData={console.log}>
      {({ isDragActive }) => (
        isDragActive
          ? 'Drag is active, drop it or leave it'
          : 'Drag is inactive, drag it already'
      )}
    </Loader>
  </Container>
)
