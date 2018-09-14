[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]

# geolocation

  Flex API for HTML5 geolocation.

## Installation

  Install with [npm(1)](https://npmjs.com):

    $ npm install -S html5-geolocation

  Live demo is [here](https://pirxpilot.github.io/geolocation/).

## API

### get

Determine current device location

```javascript
var geo = require('geolocation')();

geo.get(function(err, position) {
  if (!err) {
    console.log('Position is:', position);
  } else {
    console.log('Position unknown:', err.message);
  }
});

```

### watch

Watch current device location and periodically emit position event.

```javascript
var geo = require('geolocation')();

geo
  .on('position', function(position) {
    console.log('Position is:', position);
  })
  .on('error', function(err) {
    console.log('Position unknown:', err.message);
  })
  .maxAge(45 * 1000)
  .timeout(30 * 1000)
  .highAccuracy(true)
  .watch();

```

### clear

Clears any watch in progress. Safe to call if watch is not in progress.

### Option functions

- `timeout` - maximum time to wait for location (default: 30s)
- `maxAge` - maximum age of location - (default: 60s)
- `highAccuracy` - use GPS if available (default: true)

## Events

- `position` - a new position is obtained when watching
- `error` - emitted when watching and there are problems with obtaining a new position

## License

  The MIT License (MIT)

  Copyright (c) 2014 [Damian Krzeminski](https://pirxpilot.me)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/html5-geolocation.svg
[npm-url]: https://npmjs.org/package/html5-geolocation

[travis-url]: https://travis-ci.org/pirxpilot/geolocation
[travis-image]: https://img.shields.io/travis/pirxpilot/geolocation.svg

[deps-image]: https://img.shields.io/david/pirxpilot/geolocation.svg
[deps-url]: https://david-dm.org/pirxpilot/geolocation
