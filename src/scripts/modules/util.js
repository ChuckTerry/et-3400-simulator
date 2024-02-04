/**
 * Pad the beginning of a string with a character to the specified length.
 * @param {string} string The string to pad.
 * @param {string} character The padding character.
 * @param {number} length The length to pad to.
 * @returns {string} The padded string.
 */
function padLeft(string = '', character = '', length = 0) {
  const padLength = length - string.length;
  return padLength < 1
    ? string
    : `${character.repeat(padLength) }${string}`;
}

/**
 * Converts a number to binary and pads it to 8 characters.
 * @param {string|number} number The number to convert
 * @returns {string} The padded binary string.
 */
export function padByteBinary(number = 0) {
  if (typeof number === 'string') {
    number = Number.parseInt(number, 10);
  }
  const result = padLeft(number.toString(2), '0', 8);
  return result.length < 9 ? result : result.substr(-8);
}

/**
 * Converts a number to hex and pads it to 4 characters.
 * @param {string|number} number The number to convert
 * @returns {string} The padded hex string
 */
export function padWordHex(number = 0) {
  if (typeof number === 'string') {
    number = Number.parseInt(number, 10);
  }
  const result = padLeft(number.toString(16), '0', 4);
  return result.length < 5 ? result : result.substr(-4);
}

/**
 * Converts a URL query string into an object.
 * @param {string} string The URL query string.
 * @returns {object} The object representation of the query string.
 */
export function getQueryObject(string = location.search.slice(1)) {
  const object = {};
  const kvArray = string.split('&');
  const propertyCount = kvArray.length;
  for (let index = 0; index < propertyCount; index++) {
    const [key, value] = kvArray[index].split('=');
    object[key] = value;
  }
  return object;
}
