
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("yields-approximate-time/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Round.\n\
 */\n\
\n\
var round = Math.round;\n\
\n\
/**\n\
 * Get approximate human readable time with `date`.\n\
 *\n\
 * @param {Number|Date} date\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(date){\n\
  var now = new Date;\n\
  var t;\n\
\n\
  // past / future\n\
  var diff = date > now\n\
    ? date - now\n\
    : now - date;\n\
\n\
  // just now\n\
  if (1e3 > diff) return 'just now';\n\
\n\
  // s, m, h, d, w, m, y\n\
  if (60 > (t = round(diff / 1e3))) return format(t, 'second');\n\
  if (60 > (t = round(diff / 6e4))) return format(t, 'minute');\n\
  if (24 > (t = round(diff / 3.6e+6))) return format(t, 'hour');\n\
  if (7 > (t = round(diff / 8.64e+7))) return format(t, 'day');\n\
  if (4.34812 > (t = diff / 6.048e+8)) return format(round(t), 'week');\n\
  if (12 > (t = round(diff / 2.63e+9))) return format(t, 'month');\n\
  if (10 > (t = round(diff / 3.156e+10))) return format(t, 'year');\n\
\n\
  // decades\n\
  return format(round(diff / 3.156e+11), 'decade');\n\
};\n\
\n\
/**\n\
 * Format `n` with `unit`.\n\
 *\n\
 * @param {Number} n\n\
 * @param {String} unit\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function format(n, unit){\n\
  var a = 'hour' == unit ? 'an' : 'a';\n\
  unit = 1 == n ? unit : unit + 's';\n\
  return (1 == n ? a : n)\n\
    + ' ' + unit;\n\
}\n\
//@ sourceURL=yields-approximate-time/index.js"
));
require.register("yields-ago/index.js", Function("exports, require, module",
"\n\
/**\n\
 * dependencies\n\
 */\n\
\n\
var time = require('approximate-time');\n\
\n\
/**\n\
 * Convert the given `Date` to a human readable string.\n\
 *\n\
 * @param {Date} date\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(date){\n\
  if (new Date < date) return '';\n\
  var ret = time(date);\n\
  return 'just now' != ret\n\
    ? ret + ' ago'\n\
    : ret;\n\
};\n\
//@ sourceURL=yields-ago/index.js"
));
require.register("geolocation/index.js", Function("exports, require, module",
"var Emitter = require('emitter');\n\
\n\
module.exports = tracker;\n\
\n\
function noop() {}\n\
\n\
var dummyGeolocation = {\n\
  clearPosition: noop,\n\
  getCurrentPosition: noop,\n\
  clearWatch: noop\n\
};\n\
\n\
function tracker() {\n\
\n\
  var self,\n\
    geolocation,\n\
    watcher,\n\
    options = {\n\
      enableHighAccuracy: true,  // use GPS if available\n\
      maximumAge: 60000, // 60 seconds\n\
      timeout: 30000  // 30 seconds\n\
    };\n\
\n\
  function timeout(t) {\n\
    options.timeout = t;\n\
    return self;\n\
  }\n\
\n\
  function highAccuracy(ha) {\n\
    options.enableHighAccuracy = ha;\n\
    return self;\n\
  }\n\
\n\
  function maximumAge(ma) {\n\
    options.maximumAge = ma;\n\
    return self;\n\
  }\n\
\n\
  function get(fn) {\n\
    geolocation.getCurrentPosition(function success(position) {\n\
      fn(null, position);\n\
    }, function error(e) {\n\
      fn(e);\n\
    }, options);\n\
    return self;\n\
  }\n\
\n\
  function watch() {\n\
    clear();\n\
    watcher = geolocation.watchPosition(function success(position) {\n\
      self.emit('position', position);\n\
    }, function error(e) {\n\
      self.emit('error', e);\n\
    }, options);\n\
    return self;\n\
  }\n\
\n\
  function clear() {\n\
    if (watcher) {\n\
      geolocation.clearWatch(watcher);\n\
      watcher = undefined;\n\
    }\n\
    return self;\n\
  }\n\
\n\
  if ('geolocation' in navigator) {\n\
    geolocation = navigator.geolocation;\n\
  } else {\n\
    geolocation = dummyGeolocation;\n\
  }\n\
\n\
  self = {\n\
    get: get,\n\
    watch: watch,\n\
    clear: clear,\n\
    timeout: timeout,\n\
    maximumAge: maximumAge,\n\
    highAccuracy: highAccuracy\n\
  };\n\
\n\
  return Emitter(self);\n\
}\n\
//@ sourceURL=geolocation/index.js"
));




require.alias("component-emitter/index.js", "geolocation/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");

require.alias("yields-ago/index.js", "geolocation/deps/ago/index.js");
require.alias("yields-ago/index.js", "geolocation/deps/ago/index.js");
require.alias("yields-ago/index.js", "ago/index.js");
require.alias("yields-approximate-time/index.js", "yields-ago/deps/approximate-time/index.js");
require.alias("yields-approximate-time/index.js", "yields-ago/deps/approximate-time/index.js");
require.alias("yields-approximate-time/index.js", "yields-approximate-time/index.js");
require.alias("yields-ago/index.js", "yields-ago/index.js");
require.alias("geolocation/index.js", "geolocation/index.js");