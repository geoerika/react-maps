import { color } from 'd3-color'


/**
 * strToArrayColor - transforms a string format color ex.'#0062d9' into an array of rgb color values
 * @param { object } param
 * @param { string } param.strColor - string format color
 * @returns { array  } - an array of rgb color values [r, g, b]
 */
export const strToArrayColor = ({ strColor }) => {
  const layerColor = color(strColor)
  return [layerColor.r, layerColor.g, layerColor.b]
}

/**
 * getArrayFillColors - converts an array of string format colour in array format
 * @param { object } param
 * @param { string } param.fillColors - array of string format colours ['#0062d9', '#dd196b']
 * @returns { array } - array format colour [[r, g, b]]
 */
export const getArrayFillColors = ({ fillColors }) =>
  fillColors.map((strColor) => {
    return strToArrayColor({ strColor })
  })

/**
* arrayToRGBAStrColor - converts an array format colour [r, g, b] in a string format colour
* @param { object } param
* @param { array || function } param.color - function or array of Deck.gl layer fill colours
* @param { string } param.opacity - opacity value
* @returns { array } - string format colour 'rgb(r, g, b, opacity)'
*/
export const arrayToRGBAStrColor = ({ color, opacity = 1 }) => {
  const finalColor = typeof color === 'function' ? color(0)(1) : color
  return `rgba(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]}, ${opacity})`
}

/**
* getArrayGradientFillColors - converts an array of string or array format colours
* in an array of rgba string format colours
* @param { object } param
* @param { array } param.fillColors - array of string or array format colours
                                      ex: ['#0062d9', '#dd196b'] or [[214, 232, 253], [39, 85, 196]]
* @param { string } param.opacity - opacity value
* @returns { array } - array of rgba string format colours ['rgb(r, g, b, opacity)']
*/
export const getArrayGradientFillColors = ({ fillColors, opacity }) => {
  return fillColors.map(strColor => {
    const arrayColor = Array.isArray(strColor) ? strColor : strToArrayColor({ strColor })
    return `rgba(${arrayColor[0]}, ${arrayColor[1]}, ${arrayColor[2]}, ${opacity})`
  })
}
