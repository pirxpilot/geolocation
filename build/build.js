var geolocation = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/component-emitter/index.js
  var require_component_emitter = __commonJS({
    "node_modules/component-emitter/index.js"(exports, module) {
      function Emitter2(object) {
        if (object) {
          return mixin(object);
        }
        this._callbacks = /* @__PURE__ */ new Map();
      }
      function mixin(object) {
        Object.assign(object, Emitter2.prototype);
        object._callbacks = /* @__PURE__ */ new Map();
        return object;
      }
      Emitter2.prototype.on = function(event, listener) {
        const callbacks = this._callbacks.get(event) ?? [];
        callbacks.push(listener);
        this._callbacks.set(event, callbacks);
        return this;
      };
      Emitter2.prototype.once = function(event, listener) {
        const on = (...arguments_) => {
          this.off(event, on);
          listener.apply(this, arguments_);
        };
        on.fn = listener;
        this.on(event, on);
        return this;
      };
      Emitter2.prototype.off = function(event, listener) {
        if (event === void 0 && listener === void 0) {
          this._callbacks.clear();
          return this;
        }
        if (listener === void 0) {
          this._callbacks.delete(event);
          return this;
        }
        const callbacks = this._callbacks.get(event);
        if (callbacks) {
          for (const [index, callback] of callbacks.entries()) {
            if (callback === listener || callback.fn === listener) {
              callbacks.splice(index, 1);
              break;
            }
          }
          if (callbacks.length === 0) {
            this._callbacks.delete(event);
          } else {
            this._callbacks.set(event, callbacks);
          }
        }
        return this;
      };
      Emitter2.prototype.emit = function(event, ...arguments_) {
        const callbacks = this._callbacks.get(event);
        if (callbacks) {
          const callbacksCopy = [...callbacks];
          for (const callback of callbacksCopy) {
            callback.apply(this, arguments_);
          }
        }
        return this;
      };
      Emitter2.prototype.listeners = function(event) {
        return this._callbacks.get(event) ?? [];
      };
      Emitter2.prototype.listenerCount = function(event) {
        if (event) {
          return this.listeners(event).length;
        }
        let totalCount = 0;
        for (const callbacks of this._callbacks.values()) {
          totalCount += callbacks.length;
        }
        return totalCount;
      };
      Emitter2.prototype.hasListeners = function(event) {
        return this.listenerCount(event) > 0;
      };
      Emitter2.prototype.addEventListener = Emitter2.prototype.on;
      Emitter2.prototype.removeListener = Emitter2.prototype.off;
      Emitter2.prototype.removeEventListener = Emitter2.prototype.off;
      Emitter2.prototype.removeAllListeners = Emitter2.prototype.off;
      if (typeof module !== "undefined") {
        module.exports = Emitter2;
      }
    }
  });

  // index.js
  var index_exports = {};
  __export(index_exports, {
    default: () => tracker
  });
  var import_component_emitter = __toESM(require_component_emitter(), 1);
  function noop() {
  }
  var dummyGeolocation = {
    watchPosition: noop,
    getCurrentPosition: noop,
    clearWatch: noop
  };
  function tracker() {
    const options = {
      enableHighAccuracy: true,
      // use GPS if available
      maximumAge: 6e4,
      // 60 seconds
      timeout: 3e4
      // 30 seconds
    };
    const self = {
      get,
      watch,
      clear,
      timeout,
      maximumAge,
      highAccuracy
    };
    const geolocation = "geolocation" in navigator ? navigator.geolocation : dummyGeolocation;
    let watcher;
    return (0, import_component_emitter.default)(self);
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
        (position) => fn(null, position),
        (e) => fn(e),
        options
      );
      return self;
    }
    function watch() {
      clear();
      watcher = geolocation.watchPosition(
        (position) => self.emit("position", position),
        (e) => self.emit("error", e),
        options
      );
      return self;
    }
    function clear() {
      if (watcher) {
        geolocation.clearWatch(watcher);
        watcher = void 0;
      }
      return self;
    }
  }
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=build.js.map
