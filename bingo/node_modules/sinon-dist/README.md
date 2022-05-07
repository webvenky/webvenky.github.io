# Sinon.JS standalone

This repository contains standalone builds of [Sinon.js](http://sinonjs.org/),
ready to be used. All builds are directly fetched from sinonjs.org and tagged.

## Installation

Via [npm](https://docs.npmjs.com/):

```sh
npm install sinon-dist
```

Install a specific version:

```sh
npm install sinon-dist@1.15.1
```

Install the latest version and save the version in `package.json`:

```sh
npm install sinon-dist --save-dev
```

## Usage

### Web page

```html
<script src="node_modules/sinon.js"></script>
<!-- TODO: Use sinon API! -->
```

### AMD

```js
require.config({
    sinon: 'node_modules/sinon'
});
require(['sinon'], function(sinon) {
    // TODO: use sinon API!
});
```

### Node.js (CommonJS)

```js
var sinon = require('sinon');
// TODO: Use sinon API!
```

## References

- API documentation: http://sinonjs.org/docs/
- Issue tracker: https://github.com/cjohansen/Sinon.JS/issues
- Source code: https://github.com/cjohansen/Sinon.JS
- Official download page: http://sinonjs.org/download/
- License: BSD (https://github.com/cjohansen/Sinon.JS/blob/master/LICENSE).

This repository is not affiliated in any way with the original authors of
Sinon.js.
