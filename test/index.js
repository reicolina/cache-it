/*jshint expr: true*/
// mock the browser's sessionStorage
var mock = (function () {
    var store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        }
    };
})();
Object.defineProperty(global, 'sessionStorage', { value: mock });

// constants and variables
var KEY = 'myKey', VALUE = 'myValue', NAME = 'test-cache', TIMEOUT = 0.2, LOCAL = 'LOCAL', MEMORY = 'MEMORY';
var expect = require('chai').expect,
    CacheIt = require('../index'),
    localCache = new CacheIt(LOCAL, NAME, TIMEOUT),
    memoryCache = new CacheIt(MEMORY, NAME, TIMEOUT);

// helpers
function sleep(seconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i = i + 1) {
        if ((new Date().getTime() - start) > seconds * 1000){
            break;
        }
    }
}

describe('cacheit', function() {
    it('instanciates correctly (local cache)', function () {
        expect(localCache).not.to.be.null;
    });

    it('instanciates correctly (memory cache)', function () {
        expect(memoryCache).not.to.be.null;
    });

    it('throws error if parameters are incorrect', function () {
        var invalidName = 'Cache name is required',
            invalidType = 'Invalid cache type',
            invalidExpiry = 'Expiry time for cache is required and should be greater than zero';
        expect(function () {return new CacheIt(MEMORY);}).to.throw(invalidName);
        expect(function () {return new CacheIt(MEMORY, NAME);}).to.throw(invalidExpiry);
        expect(function () {return new CacheIt(MEMORY, NAME, 0);}).to.throw(invalidExpiry);
        expect(function () {return new CacheIt();}).to.throw(invalidType);
        expect(function () {return new CacheIt(NAME);}).to.throw(invalidType);
    });

    it('puts a value in the local cache', function () {
        // happy path
        var ok = localCache.put(KEY, VALUE);
        expect(ok).to.be.ok;
        // edge cases
        ok = localCache.put();
        expect(ok).to.not.be.ok;

    });

    it('puts a value in the memory cache', function () {
        // happy path
        var ok = memoryCache.put(KEY, VALUE);
        expect(ok).to.be.ok;
        // edge cases
        ok = memoryCache.put();
        expect(ok).to.not.be.ok;

    });

    it('gets value from local cache', function () {
        localCache.put(KEY, VALUE);
        var value = localCache.get(KEY);
        expect(value).to.equal(VALUE, NAME);
    });

    it('gets value from memory cache', function () {
        memoryCache.put(KEY, VALUE);
        var value = memoryCache.get(KEY);
        expect(value).to.equal(VALUE, NAME);
    });

    it('clears the local cache', function () {
        localCache.put(KEY, VALUE);
        localCache.clear();
        var value = localCache.get(KEY);
        expect(value).to.not.be.ok;
    });

    it('clears the memory cache', function () {
        memoryCache.put(KEY, VALUE, NAME);
        memoryCache.clear();
        var value = memoryCache.get(KEY);
        expect(value).to.not.be.ok;
    });

    it('expires the local cache', function () {
        localCache.put(KEY, VALUE);
        sleep(TIMEOUT);
        var value = localCache.get(KEY);
        expect(value).to.not.be.ok;
    });

    it('expires the memory cache', function () {
        memoryCache.put(KEY, VALUE);
        sleep(TIMEOUT);
        var value = memoryCache.get(KEY);
        expect(value).to.not.be.ok;
    });
});