import test from 'tape'
import { toByteArray, fromByteArray, byteLength } from '../index.js'

test('decode url-safe style base64 strings', function (t) {
  const expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff]

  let str = '//++/++/++//'
  let actual = toByteArray(str)
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  t.equal(byteLength(str), actual.length)

  str = '__--_--_--__'
  actual = toByteArray(str)
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  t.equal(byteLength(str), actual.length)

  t.end()
})

test('encode url-safe style base64 strings', function (t) {
  const data = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff]

  let expected = '//++/++/++//'
  let actual = fromByteArray(data)
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  actual = fromByteArray(data, { variant: 'base64' })
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  expected = '__--_--_--__'
  actual = fromByteArray(data, { variant: 'base64url' })
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  t.end()
})
