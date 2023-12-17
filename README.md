@kwikwag/base64-js
==================

`base64-js` does basic base64 encoding/decoding in pure JS.

Many browsers already have base64 encoding/decoding functionality, but it is for text data, not all-purpose binary data.

Sometimes encoding/decoding binary data in the browser is useful, and that is what this module does.

## install

With [npm](https://npmjs.org) do:

`npm install git+https://github.com/kwikwag/base64-js`

For use in web browsers do:

`<script src="base64js.min.js"></script>`

Or, if you're using a module bundler, you can:

`import * as base64 from '@kwikwag/base64-js'`

## upstream support

This repository is forked from https://github.com/beatgammit/base64-js. However, they offer support:

[Get supported base64-js with the Tidelift Subscription](https://tidelift.com/subscription/pkg/npm-base64-js?utm_source=npm-base64-js&utm_medium=referral&utm_campaign=readme)

## methods

`base64-js` has three exposed functions, `byteLength`, `toByteArray` and `fromByteArray`, which both take a single required argument.

* `byteLength` - Takes a base64 string and returns length of byte array
* `toByteArray` - Takes a base64 string and returns a byte array
* `fromByteArray` - Takes a byte array and returns a base64 string

`fromByteArray` accepts an extra optional `opts` argument, with the following properties:

* `variant` - one of `"base64"` or [`"base64url"`](https://datatracker.ietf.org/doc/html/rfc4648#section-5);
  defaults to `"base64"`
* `pad` - whether to add `"="` to end of encoded string; one of `"yes"` or `"no"`;
  defaults to `"yes"`

## license

MIT
