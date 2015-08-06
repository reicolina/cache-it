# cacheit
Because caching should be simple! A Javascript cache helper object. Supports in-memory and local storage caching as well as cache expiration.

## Installation
  npm install cacheit --save

## Constructor Parameters:
- type: 'MEMORY' for memory cache or 'LOCAL' for html5 local storage (compatible with I8+)
- name: namespace for the cache's instance
- expiry: amount of seconds that the cache will be valid for

## Usage
    var CacheIt = require('cacheit');
    var cache = new CacheIt('MEMORY', 'usersStore', 180);
    cache.put('myKey', 'myValue');
    var value = cache.get('myKey');
    console.log(value);

## Tests
  npm test

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
* 1.0.0 Initial release
