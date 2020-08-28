import React, { useCallback, forwardRef } from 'react'
import PropTypes from 'prop-types'

import { useDropzone } from 'react-dropzone'
import { styled, setup } from 'goober'


setup(React.createElement)

export const convertCSVtoJSON = f => {
  // first row is readers
  const rows = f.split('\n')
  const headers = rows[0].split(',')

  return rows.slice(1)
    .filter(r => r.length)
    .map(r => r.split(',')
      .reduce((agg, ele, i) => ({ ...agg, [headers[i]]: parseFloat(ele) ? parseFloat(ele) : ele }), {}))
}


export const useLoader = ({ setData, mode = 'text', accept }) => {
  const onDrop = useCallback(([file]) => { // single file handling only for now
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onerror = () => { console.error('file reading has failed') }
    reader.onload = () => {
      setData(reader.result)
    }
    reader[mode === 'text' ? 'readAsText' : 'readAsArrayBuffer'](file)
  }, [setData, mode])

  return useDropzone({ onDrop, accept, multiple: false })
}

const Container = styled('div', forwardRef)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

// TODO: style this
const Loader = ({ setData, mode, accept, children, prompt, activePrompt}) => {
  const { getRootProps, getInputProps, isDragActive } = useLoader({ setData, mode, accept })

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} />
      {children ? (children({ isDragActive })) : (<p>{isDragActive ? activePrompt : prompt}</p>)}
    </Container>
  )
}

Loader.propTypes = {
  setData: PropTypes.func,
  mode: PropTypes.oneOf(['text', 'binary', 'bin']),
  accept: PropTypes.string,
  children: PropTypes.func,
  prompt: PropTypes.string,
  activePrompt: PropTypes.string,
}
Loader.defaultProps = {
  setData: () => {},
  mode: 'text',
  accept: null,
  children: null,
  prompt: "Drag 'n' drop a file here, or click to select files",
  activePrompt: 'Drop the file here ...',
}

export default Loader
