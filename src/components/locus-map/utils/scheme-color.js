import Values from 'values.js'

import { arrayToRGBAStrColor, strToArrayColor } from '../../../utils/color'


/**
 * getSchemeColorValues - generates colour for fill and stroke if the map is provided with only a
 *                        base schemeColour value
 * @param { string || Array } schemeColor - string or array format colour
 * @returns { object  } - { newLineColor, newLabelColor, newColorValue, newTargetColor,
 *                          newTargetLineColor, newColorValueOptions } - object of colour values for
 *                        fill and line colour to be used by deck.gl layers
 */
export const getSchemeColorValues = (schemeColor) => {
  const arraySchemeColor = Array.isArray(schemeColor) ?
    schemeColor :
    strToArrayColor({ strColor: schemeColor })
  const color = new Values(Array.isArray(schemeColor) ?
    arrayToRGBAStrColor({ color: schemeColor }) :
    schemeColor)
  const newTargetColor = [0, 1, 2].map(i => 255 - arraySchemeColor[i])
  const targetColor = new Values(arrayToRGBAStrColor({ color: newTargetColor }))
  return {
    newLineColor: color.shade(30).rgb,
    newLabelColor: color.shade(40).rgb,
    newColorValue: arraySchemeColor,
    // set newTargetColor, newTargetLineColor as complimentary colors of arraySchemeColor
    newTargetColor,
    newTargetLineColor: targetColor.shade(30).rgb,
    newColorValueOptions: [color.tint(90).rgb, arraySchemeColor],
  }
}
