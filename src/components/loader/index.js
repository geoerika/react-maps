import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { useDropzone } from 'react-dropzone'


export const useLoader = ({ setData, mode = 'text', accept }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onerror = () => { console.error('file reading has failed') }
      reader.onload = () => {
        setData(reader.result)
      }

      reader[mode === 'text' ? 'readAsText' : 'readAsArrayBuffer'](file)
    })
  }, [setData, mode])

  return useDropzone({ onDrop, accept, multiple: false })
}

// TODO: style this
const Loader = ({ setData, mode, accept, prompt, activePrompt}) => {
  const { getRootProps, getInputProps, isDragActive } = useLoader({ setData, mode, accept })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>{isDragActive ? activePrompt : prompt}</p>
    </div>
  )
}

Loader.propTypes = {
  setData: PropTypes.func,
  mode: PropTypes.oneOf(['text', 'binary', 'bin']),
  accept: PropTypes.string,
  prompt: PropTypes.string,
  activePrompt: PropTypes.string,
}
Loader.defaultProps = {
  setData: () => {},
  mode: 'text',
  accept: null,
  prompt: 'Drop the file here ...',
  activePrompt: "Drag 'n' drop a file here, or click to select files",
}

export default Loader
