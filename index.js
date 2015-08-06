var MEMORY = 'MEMORY';
var LOCAL = 'LOCAL';

// Constructor
function CacheIt(type, name, expiry) {
    if (type !== LOCAL && type !== MEMORY) {
        throw 'Invalid cache type';
    }
    if (!name) {
        throw 'Cache name is required';
    }
    if (!expiry || expiry === 0) {
        throw 'Expiry time for cache is required and should be greater than zero';
    }
    this.cache = {
        createdOn: new Date().getTime(),
        expiry: expiry,
        data: {}
    };
    this.name = name;
    this.type = type;
    if (this.type === LOCAL) {
        if (!sessionStorage.getItem(name)) {
            sessionStorage.setItem(name, JSON.stringify(this.cache));
        }
    }
}

// class methods
CacheIt.prototype.clear = function () {
    this.cache.createdOn = new Date().getTime();
    this.cache.data = {};
    if (this.type === LOCAL) {
        var myCache =  JSON.parse(sessionStorage.getItem(this.name));
        myCache = this.cache;
        sessionStorage.setItem(this.name, JSON.stringify(myCache));
    }
};

CacheIt.prototype.get = function (key) {
    var now = new Date().getTime(), myCache;
    if (this.type === LOCAL) {
        myCache =  JSON.parse(sessionStorage.getItem(this.name));
    } else { // default to memory cache
        myCache = this.cache;
    }
    // check if the data is still valid
    if (now - myCache.createdOn >= myCache.expiry * 1000) {
        this.clear();
        return; // data has expired, so return a miss
    }
    var record = myCache.data[key];
    if (!record) {
        // the record is not in the cache
        return;
    }
    return record;
};

CacheIt.prototype.put = function (key, record) {
    try {
        if (!key) {
            // no key, no cache!
            return false;
        }
        if (this.type === LOCAL) {
            var localCache = JSON.parse(sessionStorage.getItem(this.name));
            localCache.data[key] = record;
            sessionStorage.setItem(this.name, JSON.stringify(localCache));
        } else { // default to memory cache
            this.cache.data[key] = record;
        }
        return true;
    } catch (e) {
        return false;
    }
};

// export the class
module.exports = CacheIt;
