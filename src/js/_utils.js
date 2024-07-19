/**
 * Formats a file size into a human-readable string
 * @param {number} number - File size in bytes
 * @returns {string}
 */
export function returnFileSize(number) {
  if (number < 1e3) {
    return `${number} bytes`
  } else if (number >= 1e3 && number < 1e6) {
    return `${(number / 1e3).toFixed(2)} KB`
  } else {
    return `${(number / 1e6).toFixed(2)} MB`
  }
}
