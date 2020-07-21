import { useState, useEffect } from 'react'


export const useDimensions = (ref, w, h) => {
  const [dimensions, setDimensions] = useState({ h, w })
  useEffect(() => {
    if (ref && ref.current) {
      setDimensions({
        h: ref.current.offsetHeight,
        w: ref.current.offsetWidth,
      })
    }
  }, [ref])

  return dimensions
}