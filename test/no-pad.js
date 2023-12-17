import test from 'tape'
import { fromByteArray } from '../index.js'

test('encode without padding', function (t) {
  const zeros = new Uint8Array(11)

  let expected = 'AAAAAAAAAAAAAAA='
  let actual = fromByteArray(zeros)
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  expected = 'AAAAAAAAAAAAAAA='
  actual = fromByteArray(zeros, { pad: 'yes' })
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  expected = 'AAAAAAAAAAAAAAA'
  actual = fromByteArray(zeros, { pad: 'no' })
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  expected = 'AAAAAAAAAAAAAA=='
  actual = fromByteArray(zeros.slice(0, -1))
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  expected = 'AAAAAAAAAAAAAA'
  actual = fromByteArray(zeros.slice(0, -1), { pad: 'no' })
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  t.end()
})
