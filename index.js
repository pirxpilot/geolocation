const Emitter = require('component-emitter');

module.exports = tracker;

function noop() {}

const dummyGeolocation = {
  watchPosition: noop,
  getCurrentPosition: noop,
  clearWatch: noop
};

function tracker() {
  const options = {
    enableHighAccuracy: true,  // use GPS if available
    maximumAge: 60000, // 60 seconds
    timeout: 30000  // 30 seconds
  };

  const self = {
    get,
    watch,
    clear,
    timeout,
    maximumAge,
    highAccuracy
  };

  const geolocation = 'geolocation' in navigator ? navigator.geolocation: dummyGeolocation;
  let watcher;

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
    geolocation.getCurrentPosition(
      position => fn(null, position),
      e => fn(e),
      options
    );
    return self;
  }

  function watch() {
    clear();
    watcher = geolocation.watchPosition(
      position => self.emit('position', position),
      e => self.emit('error', e),
      options
    );
    return self;
  }

  function clear() {
    if (watcher) {
      geolocation.clearWatch(watcher);
      watcher = undefined;
    }
    return self;
  }

  return Emitter(self);
}
