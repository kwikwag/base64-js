const revLookup = []

const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const lookupUrl = lookup.substring(0, 62) + '-_'
for (let i = 0, len = lookup.length; i < len; ++i) {
  revLookup[lookup.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup[lookupUrl.charCodeAt(62)] = 62
revLookup[lookupUrl.charCodeAt(63)] = 63

function getLens (b64) {
  const len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  let validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  const placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

/**
 * Calculates the number of bytes required in order to hold the decoded
 * `b64` value.
 *
 * base64 is 4/3 + up to two characters of the original data
 * @param {string} b64 base64-encoded string
 */
export function byteLength (b64) {
  const lens = getLens(b64)
  const validLen = lens[0]
  const placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

/**
 * Converts a base64 string to Uint8Array.
 * @param {string} b64 base64-encoded string
 */
export function toByteArray (b64) {
  const lens = getLens(b64)
  const validLen = lens[0]
  const placeHoldersLen = lens[1]

  const arr = new Uint8Array(_byteLength(b64, validLen, placeHoldersLen))

  let curByte = -1

  // if there are placeholders, only get up to the last complete 4 chars
  const len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  let i
  for (i = 0; i < len; i += 4) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[++curByte] = (tmp >> 16) & 0xFF
    arr[++curByte] = (tmp >> 8) & 0xFF
    arr[++curByte] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    arr[++curByte] = 0xFF & (
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4))
  }

  if (placeHoldersLen === 1) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[++curByte] = (tmp >> 8) & 0xFF
    arr[++curByte] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num, lookup) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end, lookup) {
  const output = []
  for (let i = start; i < end; i += 3) {
    const tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp, lookup))
  }
  return output.join('')
}

/**
 * Converts a Uint8Array to a base64 string
 * @param {Uint8Array} uint8 data to base64-encode
 * @param {object} opts variant options
 * @param {string} opts.variant one of "base64" | "base64url"; defaults to "base64"
 * @param {boolean} opts.pad one of "no" | "yes"; defaults to "yes"
 */
export function fromByteArray (uint8, opts) {
  const len = uint8.length
  const extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  const parts = []
  const maxChunkLength = 16383 // must be multiple of 3

  opts = opts || {}
  const variant = opts.variant || 'base64'
  const l = variant === 'base64' ? lookup : variant === 'base64url' ? lookupUrl : undefined
  if (l === undefined) {
    throw new Error('Invalid variant')
  }
  const pad = (opts.pad || 'yes') === 'yes'

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength), l))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    const tmp = uint8[len - 1]
    parts.push(
      l[tmp >> 2] +
      l[(tmp << 4) & 0x3F] +
      (pad ? '==' : '')
    )
  } else if (extraBytes === 2) {
    const tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      l[tmp >> 10] +
      l[(tmp >> 4) & 0x3F] +
      l[(tmp << 2) & 0x3F] +
      (pad ? '=' : '')
    )
  }

  return parts.join('')
}
