var Emitter = require('emitter');

module.exports = tracker;

function noop() {}

var dummyGeolocation = {
  clearPosition: noop,
  getCurrentPosition: noop,
  clearWatch: noop
};

function tracker() {

  var self,
    geolocation,
    watcher,
    options = {
      enableHighAccuracy: true,  // use GPS if available
      maximumAge: 60000, // 60 seconds
      timeout: 30000  // 30 seconds
    };

  function timeout(t) {
    options.timeout = t;
    return self;
  }

  function highAccuracy(ha) {
    options.enableHighAccuracy = ha;
    return self;
  }

  function maximumAge(ma) {
    options.maximumAge = ma;
    return self;
  }

  function get(fn) {
    geolocation.getCurrentPosition(function success(position) {
      fn(null, position);
    }, function error(e) {
      fn(e);
    }, options);
    return self;
  }

  function watch() {
    clear();
    watcher = geolocation.watchPosition(function success(position) {
      self.emit('position', position);
    }, function error(e) {
      self.emit('error', e);
    }, options);
    return self;
  }

  function clear() {
    if (watcher) {
      geolocation.clearWatch(watcher);
      watcher = undefined;
    }
    return self;
  }

  if ('geolocation' in navigator) {
    geolocation = navigator.geolocation;
  } else {
    geolocation = dummyGeolocation;
  }

  self = {
    get: get,
    watch: watch,
    clear: clear,
    timeout: timeout,
    maximumAge: maximumAge,
    highAccuracy: highAccuracy
  };

  return Emitter(self);
}
