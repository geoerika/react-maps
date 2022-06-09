import { FONT_SIZE  } from '../constants'

/**
 * truncate - returns formatted string, by truncating to a certain nr of characters
 * @param { string } fullStr - string to format
 * @param { number } strLen - length of formatted string
 * @param { string } separator - string to separate formatted string
 * @returns { string } - formatted string
 */
export const truncate = (fullStr, strLen, separator = ' ... ') => {
  if (fullStr.toString().length <= strLen) {
    return fullStr
  }
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const endChars = Math.floor(charsToShow / 2)

  return fullStr.toString()?.substring(0, frontChars) +
         separator +
         fullStr.toString()?.substring(fullStr.length + 1 - endChars)
}

// "vendored" from https://github.com/mdevils/html-entities/blob/68a1a96/src/xml-entities.ts
const decodeXML = (str) => {
  const ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&',
  }
  if (!str || !str.length) {
    return ''
  }
  return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
    if (s.charAt(1) === '#') {
      const code = s.charAt(2).toLowerCase() === 'x' ?
        parseInt(s.substr(3), 16) :
        parseInt(s.substr(2))

      if (isNaN(code) || code < -32768 || code > 65535) {
        return ''
      }
      return String.fromCharCode(code)
    }
    return ALPHA_INDEX[s] || s
  })
}

/**
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/50813259#50813259
 * getTextSize - calculates a rendered text width and height in rem
 * @param { string } text - a text string
 * @param { number || string } fontWeight - text's font weight
 * @param { number } fontSize - text's font size in pixels
 * @param { string } fontFamily - text's font family
 * @returns { object } - the width and height of the rendered text in rem
 */
export const getTextSize = (text, fontWeight, fontSize, fontFamily) => {
  let font = `${fontWeight} ${fontSize}px ${fontFamily}`
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let metrics = typeof text === 'number'
    ? context.measureText(text)
    : context.measureText(decodeXML(text))
  return {
    width: Math.ceil((metrics.width / FONT_SIZE) * 100) / 100,
    height: (((metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / FONT_SIZE) * 100) / 100,
  }
}
