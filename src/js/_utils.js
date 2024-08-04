/**
 * Convert number of bytes into a human-readable format
 *
 * If unspecified, threshold defaults to 100, e.g., 100.1 KB becomes 100 KB.
 * For our use case, if image >= 100 KB, the decimals don't matter, so we
 * hide that information to reduce cognitive load for users.
 *
 * @param {number} bytes             - Number of bytes to convert
 * @param {Object} options
 * @param {number} options.precision - Number of digits after the decimal separator (default: 1)
 * @param {number} options.threshold - Trim decimal when the integer part of the result is greater than or equal to this value (default: 100)
 * @returns string
 */
export function bytesToSize(
  bytes,
  { precision = 1, threshold = 100} = {},
) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let l = 0, n = parseInt(bytes, 10) || 0
  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  return +n.toFixed(n < threshold && l > 0 ? precision : 0) + ' ' + units[l]
}
