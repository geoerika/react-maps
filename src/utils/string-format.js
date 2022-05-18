/**
 * truncate - returns formatted string, by truncating to a certain nr of characters
 * @param { string } fullStr - string to format
 * @param { number } strLen - length of formatted string
 * @param { string } separator - string to separate formatted string
 * @returns { string } - formatted string
 */
export function truncate(fullStr, strLen, separator = ' ... ') {
  if (fullStr.length <= strLen) {
    return fullStr
  }
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const endChars = Math.floor(charsToShow / 2)

  return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length + 1 - endChars)
}
