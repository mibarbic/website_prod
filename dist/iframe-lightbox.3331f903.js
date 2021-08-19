// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/js/iframe-lightbox.js":[function(require,module,exports) {
/*!
 * @see {@link https://github.com/englishextra/iframe-lightbox}
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} settings object
 * el.lightbox = new IframeLightbox(elem, settings)
 * passes jshint
 */

/*jslint browser: true */

/*jslint node: true */

/*jshint -W014 */
(function (root, document) {
  "use strict";

  var docElem = document.documentElement || "";
  var docBody = document.body || "";
  var containerClass = "iframe-lightbox";
  var iframeLightboxWindowIsBindedClass = "iframe-lightbox-window--is-binded";
  var iframeLightboxOpenClass = "iframe-lightbox--open";
  var iframeLightboxLinkIsBindedClass = "iframe-lightbox-link--is-binded";
  var isLoadedClass = "is-loaded";
  var isOpenedClass = "is-opened";
  var isShowingClass = "is-showing";
  var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
  var isTouch = isMobile !== null || document.createTouch !== undefined || "ontouchstart" in root || "onmsgesturechange" in root || navigator.msMaxTouchPoints;

  var IframeLightbox = function IframeLightbox(elem, settings) {
    var options = settings || {};
    this.trigger = elem;
    this.el = document.getElementsByClassName(containerClass)[0] || "";
    this.body = this.el ? this.el.getElementsByClassName("body")[0] : "";
    this.content = this.el ? this.el.getElementsByClassName("content")[0] : "";
    this.src = elem.dataset.src || "";
    this.href = elem.getAttribute("href") || "";
    this.dataPaddingBottom = elem.dataset.paddingBottom || "";
    this.dataScrolling = elem.dataset.scrolling || "";
    this.dataTouch = elem.dataset.touch || "";
    this.rate = options.rate || 500;
    this.scrolling = options.scrolling;
    this.touch = options.touch;
    this.onOpened = options.onOpened;
    this.onIframeLoaded = options.onIframeLoaded;
    this.onLoaded = options.onLoaded;
    this.onCreated = options.onCreated;
    this.onClosed = options.onClosed;
    this.init();
  };

  IframeLightbox.prototype.init = function () {
    var _this = this;

    if (!this.el) {
      this.create();
    }

    var debounce = function debounce(func, wait) {
      var timeout, args, context, timestamp;
      return function () {
        context = this;
        args = [].slice.call(arguments, 0);
        timestamp = new Date();

        var later = function later() {
          var last = new Date() - timestamp;

          if (last < wait) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            func.apply(context, args);
          }
        };

        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
      };
    };

    var logic = function logic() {
      _this.open();
    };

    var handleIframeLightboxLink = function handleIframeLightboxLink(e) {
      e.stopPropagation();
      e.preventDefault();
      debounce(logic, this.rate).call();
    };

    if (!this.trigger.classList.contains(iframeLightboxLinkIsBindedClass)) {
      this.trigger.classList.add(iframeLightboxLinkIsBindedClass);
      this.trigger.addEventListener("click", handleIframeLightboxLink);

      if (isTouch && (_this.touch || _this.dataTouch)) {
        this.trigger.addEventListener("touchstart", handleIframeLightboxLink);
      }
    }
  };

  IframeLightbox.prototype.create = function () {
    var _this = this,
        backdrop = document.createElement("div");

    backdrop.classList.add("backdrop");
    this.el = document.createElement("div");
    this.el.classList.add(containerClass);
    this.el.appendChild(backdrop);
    this.content = document.createElement("div");
    this.content.classList.add("content");
    this.body = document.createElement("div");
    this.body.classList.add("body");
    this.content.appendChild(this.body);
    this.contentHolder = document.createElement("div");
    this.contentHolder.classList.add("content-holder");
    this.contentHolder.appendChild(this.content);
    this.el.appendChild(this.contentHolder);
    this.btnClose = document.createElement("button");
    this.btnClose.classList.add("btn-close");
    this.el.appendChild(this.btnClose);
    docBody.appendChild(this.el);
    backdrop.addEventListener("click", function () {
      _this.close();
    });
    this.btnClose.addEventListener("click", function () {
      _this.close();
    });

    if (!docElem.classList.contains(iframeLightboxWindowIsBindedClass)) {
      docElem.classList.add(iframeLightboxWindowIsBindedClass);
      root.addEventListener("keyup", function (ev) {
        if (27 === (ev.which || ev.keyCode)) {
          _this.close();
        }
      });
    }

    var clearBody = function clearBody() {
      if (_this.isOpen()) {
        return;
      }

      _this.el.classList.remove(isShowingClass);

      _this.body.innerHTML = "";
    };

    this.el.addEventListener("transitionend", clearBody, false);
    this.el.addEventListener("webkitTransitionEnd", clearBody, false);
    this.el.addEventListener("mozTransitionEnd", clearBody, false);
    this.el.addEventListener("msTransitionEnd", clearBody, false);
    this.callCallback(this.onCreated, this);
  };

  IframeLightbox.prototype.loadIframe = function () {
    var _this = this;

    this.iframeId = containerClass + Date.now();
    this.iframeSrc = this.src || this.href || "";
    var html = [];
    html.push('<iframe src="' + this.iframeSrc + '" name="' + this.iframeId + '" id="' + this.iframeId + '" onload="this.style.opacity=1;" style="opacity:0;border:none;" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>');
    html.push('<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>');
    this.body.innerHTML = html.join("");

    (function (iframeId, body) {
      var iframe = document.getElementById(iframeId);

      iframe.onload = function () {
        this.style.opacity = 1;
        body.classList.add(isLoadedClass);

        if (_this.scrolling || _this.dataScrolling) {
          iframe.removeAttribute("scrolling");
          iframe.style.overflow = "scroll";
        } else {
          iframe.setAttribute("scrolling", "no");
          iframe.style.overflow = "hidden";
        }

        _this.callCallback(_this.onIframeLoaded, _this);

        _this.callCallback(_this.onLoaded, _this);
      };
    })(this.iframeId, this.body);
  };

  IframeLightbox.prototype.open = function () {
    this.loadIframe();

    if (this.dataPaddingBottom) {
      this.content.style.paddingBottom = this.dataPaddingBottom;
    } else {
      this.content.removeAttribute("style");
    }

    this.el.classList.add(isShowingClass);
    this.el.classList.add(isOpenedClass);
    docElem.classList.add(iframeLightboxOpenClass);
    docBody.classList.add(iframeLightboxOpenClass);
    this.callCallback(this.onOpened, this);
  };

  IframeLightbox.prototype.close = function () {
    this.el.classList.remove(isOpenedClass);
    this.body.classList.remove(isLoadedClass);
    docElem.classList.remove(iframeLightboxOpenClass);
    docBody.classList.remove(iframeLightboxOpenClass);
    this.callCallback(this.onClosed, this);
  };

  IframeLightbox.prototype.isOpen = function () {
    return this.el.classList.contains(isOpenedClass);
  };

  IframeLightbox.prototype.callCallback = function (func, data) {
    if (typeof func !== "function") {
      return;
    }

    var caller = func.bind(this);
    caller(data);
  };

  root.IframeLightbox = IframeLightbox;
})("undefined" !== typeof window ? window : this, document);
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60766" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/iframe-lightbox.js"], null)
//# sourceMappingURL=/iframe-lightbox.3331f903.js.map