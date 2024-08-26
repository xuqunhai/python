(function (e, a) {
  for (var i in a) e[i] = a[i];
})(
  window,
  /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      });
      /******/
      /******/ // Execute the module function
      /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      );
      /******/
      /******/ // Flag the module as loaded
      /******/ module.l = true;
      /******/
      /******/ // Return the exports of the module
      /******/ return module.exports;
      /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/ __webpack_require__.c = installedModules;
    /******/
    /******/ // identity function for calling harmony imports with the correct context
    /******/ __webpack_require__.i = function (value) {
      return value;
    };
    /******/
    /******/ // define getter function for harmony exports
    /******/ __webpack_require__.d = function (exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          /******/ configurable: false,
          /******/ enumerable: true,
          /******/ get: getter,
          /******/
        });
        /******/
      }
      /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module["default"];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, "a", getter);
      /******/ return getter;
      /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/ __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/ __webpack_require__.p = "";
    /******/
    /******/ // Load entry module and return exports
    /******/ return __webpack_require__((__webpack_require__.s = 3));
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        // 告诉系统“这个模块是使用 ES6 模块语法写的”
        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        // console.log(typeof Symbol.prototype); // "object"
        var _typeof =
          typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
            ? function (obj) {
                return typeof obj;
              }
            : function (obj) { // 早期版本的 JavaScript 引擎（特别是还不支持 ES6 的引擎）
                return obj &&
                  typeof Symbol === "function" &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype // 排除 Symbol.prototype 对象本身被误识别为 symbol 类型
                  ? "symbol"
                  : typeof obj;
              };

        exports.configEvent = configEvent;
        exports.hook = hook;
        /*
         * author: wendux
         * email: 824783146@qq.com
         * source code: https://github.com/wendux/Ajax-hook
         */

        var events = (exports.events = [
          "load", // 当网络请求成功完成时触发。
          "loadend", // 不管请求的结果如何（成功、超时、取消、失败），只要请求结束时都会触发。
          "timeout",
          "error",
          "readystatechange",
          "abort",
        ]);

        var OriginXhr = "__origin_xhr";

        function configEvent(event, xhrProxy) {
          var e = {};
          for (var attr in event) {
            e[attr] = event[attr];
          } // xhrProxy instead
          e.target = e.currentTarget = xhrProxy;
          return e;
        }

        function hook(proxy, win) {
          win = win || window;
          var originXhr = win.XMLHttpRequest;

          var hooking = true;

          var HookXMLHttpRequest = function HookXMLHttpRequest() {
            // We shouldn't hookAjax XMLHttpRequest.prototype because we can't
            // guarantee that all attributes are on the prototype。
            // Instead, hooking XMLHttpRequest instance can avoid this problem.

            var xhr = new originXhr();

            // Generate all callbacks(eg. onload) are enumerable (not undefined).
            for (var i = 0; i < events.length; ++i) {
              var key = "on" + events[i];
              if (xhr[key] === undefined) xhr[key] = null; // 确保这些事件回调属性存在，避免在代码中访问这些事件属性时出现未定义的错误。
            }
            /*
            将属性从不可枚举变成可枚举的常见方法包括：
              直接赋值（默认可枚举）。
              使用 Object.defineProperty 修改属性的 enumerable 特性。
              使用 Object.defineProperties 同时定义多个可枚举属性。
              使用 Object.assign 复制属性（注意它只复制可枚举属性）。
              使用 Object.create 创建对象并定义可枚举属性。
              修改原型链上的属性使其可枚举。
              遍历属性并手动重定义其枚举性。
            */

            for (var attr in xhr) {
              var type = "";
              try {
                type = _typeof(xhr[attr]); // May cause exception on some browser
              } catch (e) {}
              if (type === "function") {
                // hookAjax methods of xhr, such as `open`、`send` ...
                // 劫持：在这些方法执行时插入自定义的逻辑
                this[attr] = hookFunction(attr);
              } else if (attr !== OriginXhr) { // 防止对原始 XMLHttpRequest 实例进行不必要的包装或劫持。
                // 对非函数类型的属性进行包装拦截
                Object.defineProperty(this, attr, {
                  get: getterFactory(attr),
                  set: setterFactory(attr),
                  enumerable: true,
                });
              }
            }
            var that = this;
            xhr.getProxy = function () {
              return that;
            };
            this[OriginXhr] = xhr;
          };

          HookXMLHttpRequest.prototype = originXhr.prototype;
          HookXMLHttpRequest.prototype.constructor = HookXMLHttpRequest;

          win.XMLHttpRequest = HookXMLHttpRequest;

          Object.assign(win.XMLHttpRequest, {
            UNSENT: 0,
            OPENED: 1,
            HEADERS_RECEIVED: 2,
            LOADING: 3,
            DONE: 4,
          });

          // Generate getter for attributes of xhr
          function getterFactory(attr) {
            return function () {
              var originValue = this[OriginXhr][attr]; // 获取原始属性值
              if (hooking) { // 正在进行劫持
                // 是否存在一个以 attr + "_" 命名的自定义属性
                var v = this.hasOwnProperty(attr + "_")
                  ? this[attr + "_"]
                  : originValue; // 没有找到这个自定义属性，使用原始的 XMLHttpRequest 属性值 originValue。
                // 检查 proxy 对象上是否为该属性（attr）定义了一个自定义的 getter 钩子
                var attrGetterHook = (proxy[attr] || {})["getter"]; // 从 proxy 中获取对应属性的 getter 钩子。
                // 调用这个钩子函数，并传入两个参数：v（当前属性值）和 this（当前的 XMLHttpRequest 实例）。
                return (attrGetterHook && attrGetterHook(v, this)) || v;
              } else {
                // 当前不进行劫持，属性的行为完全按照浏览器原生的 XMLHttpRequest 处理。
                return originValue;
              }
            };
          }

          // Generate setter for attributes of xhr; by this we have an opportunity
          // to hookAjax event callbacks （eg: `onload`） of xhr;
          // 属性生成一个拦截器，在设置这些属性值时插入自定义逻辑
          function setterFactory(attr) {
            return function (v) {
              var xhr = this[OriginXhr]; // 获取原始 XMLHttpRequest 实例
              if (hooking) {
                var that = this;
                var hook = proxy[attr]; // 处理事件回调属性
                // hookAjax  event callbacks such as `onload`、`onreadystatechange`...
                // 判断属性是否是事件回调函数（如 onload、onreadystatechange 等）
                if (attr.substring(0, 2) === "on") {
                  that[attr + "_"] = v; // 自定义属性 attr + "_" 中（例如，onload_）。
                  xhr[attr] = function (e) { // 替换为自定义的函数
                    e = configEvent(e, that); // 将事件对象重新配置，以便在回调中正确地指向被劫持的 XMLHttpRequest 实例。
                    // 如果在 proxy 中定义了该事件的自定义处理函数，则调用该自定义函数
                    var ret = proxy[attr] && proxy[attr].call(that, xhr, e);
                    ret || v.call(that, e); // 如果自定义处理函数返回了结果，则使用该结果，否则，调用原始的回调函数 
                  };
                } else { // 处理非事件属性
                  //If the attribute isn't writable, generate proxy attribute
                  var attrSetterHook = (hook || {})["setter"]; // 从 proxy 中获取属性的 setter 钩子函数，
                  // 如果钩子函数返回了一个新的值，使用这个新值；否则使用原始的值 v。
                  v = (attrSetterHook && attrSetterHook(v, that)) || v;
                  this[attr + "_"] = v; // 将新的值存储到自定义的属性 attr + "_" 中
                  try {
                    // Not all attributes of xhr are writable(setter may undefined).
                    // 尝试将属性值赋给原始的 XMLHttpRequest 实例。
                    xhr[attr] = v;
                  } catch (e) {}
                }
              } else {
                xhr[attr] = v;
              }
            };
          }

          // Hook methods of xhr.
          function hookFunction(fun) { // 特定方法进行劫持
            return function () {
              var args = [].slice.call(arguments); // 将类数组的 arguments 对象转换为真正的数组
              // 检查是否需要劫持
              // 检查 proxy 对象上是否存在与当前方法名 fun 相同的代理函数
              // hooking：当前是否处于劫持状态。全局开关，动态启停劫持功能，保持灵活性
              if (proxy[fun] && hooking) {
                var ret = proxy[fun].call(this, args, this[OriginXhr]); // 调用代理函数，call确保代理函数可以正确地绑定到当前 XMLHttpRequest 实例上。
                // If the proxy return value exists, return it directly,
                // otherwise call the function of xhr.
                if (ret) return ret; // 返回值存在，则直接返回该值。
              }
              // 调用原始方法
              return this[OriginXhr][fun].apply(this[OriginXhr], args);
            };
          }

          function unHook() {
            hooking = false;
            if (win.XMLHttpRequest === HookXMLHttpRequest) {
              win.XMLHttpRequest = originXhr;
              HookXMLHttpRequest.prototype.constructor = originXhr;
              originXhr = undefined; // 解除劫持时清理掉引用，避免意外的内存泄漏和不必要的引用残留。
            }
          }

          // Return the real XMLHttpRequest and unHook func
          return { originXhr: originXhr, unHook: unHook };
        }

        /***/
      },
      /* 1 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.proxy = proxy;

        var _xhrHook = __webpack_require__(0);

        var eventLoad = _xhrHook.events[0],
          eventLoadEnd = _xhrHook.events[1],
          eventTimeout = _xhrHook.events[2],
          eventError = _xhrHook.events[3],
          eventReadyStateChange = _xhrHook.events[4],
          eventAbort = _xhrHook.events[5];
        /*
         * author: wendux
         * email: 824783146@qq.com
         * source code: https://github.com/wendux/Ajax-hook
         */

        var prototype = "prototype";

        function proxy(proxy, win) {
          win = win || window;
          return proxyAjax(proxy, win);
        }

        function trim(str) {
          return str.replace(/^\s+|\s+$/g, "");
        }

        function getEventTarget(xhr) {
          return xhr.watcher || (xhr.watcher = document.createElement("a"));
        }

        function triggerListener(xhr, name) {
          var xhrProxy = xhr.getProxy();
          var callback = "on" + name + "_";
          var event = (0, _xhrHook.configEvent)({ type: name }, xhrProxy);
          xhrProxy[callback] && xhrProxy[callback](event);
          var evt;
          if (typeof Event === "function") {
            evt = new Event(name, { bubbles: false });
          } else {
            // https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11
            evt = document.createEvent("Event");
            evt.initEvent(name, false, true);
          }
          getEventTarget(xhr).dispatchEvent(evt);
        }

        function Handler(xhr) {
          this.xhr = xhr;
          this.xhrProxy = xhr.getProxy();
        }

        Handler[prototype] = Object.create({
          resolve: function resolve(response) {
            var xhrProxy = this.xhrProxy;
            var xhr = this.xhr;
            xhrProxy.readyState = 4;
            xhr.resHeader = response.headers;
            xhrProxy.response = xhrProxy.responseText = response.response;
            xhrProxy.statusText = response.statusText;
            xhrProxy.status = response.status;
            triggerListener(xhr, eventReadyStateChange);
            triggerListener(xhr, eventLoad);
            triggerListener(xhr, eventLoadEnd);
          },
          reject: function reject(error) {
            this.xhrProxy.status = 0;
            triggerListener(this.xhr, error.type);
            triggerListener(this.xhr, eventLoadEnd);
          },
        });

        // 生成了处理程序，每个处理程序都负责请求流程的一个部分
        function makeHandler(next) {
          // sub 实例就可以继承和使用 Handler 的功能。
          function sub(xhr) {
            Handler.call(this, xhr);
          }

          sub[prototype] = Object.create(Handler[prototype]);
          // 每个子处理程序都有一个 next 函数，用于在链式处理流程中调用下一个处理阶段。
          sub[prototype].next = next; // 这里将控制权传递给下一个处理程序
          return sub;
        }

        // 具体的处理程序，负责最终执行 HTTP 请求。
        // 传递给 makeHandler 的这个函数就是原始 XMLHttpRequest 执行 send 方法的逻辑。
        var RequestHandler = makeHandler(function (rq) {
          var xhr = this.xhr;
          rq = rq || xhr.config;
          xhr.withCredentials = rq.withCredentials;
          xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
          for (var key in rq.headers) {
            xhr.setRequestHeader(key, rq.headers[key]);
          }
          xhr.send(rq.body); // 在 send 方法中的控制权传递
        });

        var ResponseHandler = makeHandler(function (response) {
          this.resolve(response);
        });

        var ErrorHandler = makeHandler(function (error) {
          this.reject(error);
        });

        function proxyAjax(proxy, win) {
          var onRequest = proxy.onRequest,
            onResponse = proxy.onResponse,
            onError = proxy.onError;

          function getResponseData(xhrProxy) {
            var responseType = xhrProxy.responseType;
            if (!responseType || responseType === "text") {
              return xhrProxy.responseText;
            }
            // reference: https://shanabrian.com/web/html-css-js-technics/js-ie10-ie11-xhr-json-string.php
            // reference: https://github.com/axios/axios/issues/2390
            // json - W3C standard - xhrProxy.response = JSON object; responseText is unobtainable
            // For details, see https://github.com/wendux/ajax-hook/issues/117
            // IE 9, 10 & 11 - only responseText
            var response = xhrProxy.response;
            if (responseType === "json" && !response) {
              try {
                return JSON.parse(xhrProxy.responseText);
              } catch (e) {
                console.warn(e);
              }
            }
            return response;
          }

          function handleResponse(xhr, xhrProxy) {
            var handler = new ResponseHandler(xhr);
            var ret = {
              response: getResponseData(xhrProxy),
              status: xhrProxy.status,
              statusText: xhrProxy.statusText,
              config: xhr.config,
              headers:
                xhr.resHeader ||
                xhr
                  .getAllResponseHeaders()
                  .split("\r\n")
                  .reduce(function (ob, str) {
                    if (str === "") return ob;
                    var m = str.split(":");
                    ob[m.shift()] = trim(m.join(":"));
                    return ob;
                  }, {}),
            };
            if (!onResponse) return handler.resolve(ret);
            onResponse(ret, handler);
          }

          function onerror(xhr, xhrProxy, error, errorType) {
            var handler = new ErrorHandler(xhr);
            error = { config: xhr.config, error: error, type: errorType };
            if (onError) {
              onError(error, handler);
            } else {
              handler.next(error);
            }
          }

          function preventXhrProxyCallback() {
            return true;
          }

          function errorCallback(errorType) {
            return function (xhr, e) {
              onerror(xhr, this, e, errorType);
              return true;
            };
          }

          function stateChangeCallback(xhr, xhrProxy) {
            if (xhr.readyState === 4 && xhr.status !== 0) {
              handleResponse(xhr, xhrProxy);
            } else if (xhr.readyState !== 4) {
              triggerListener(xhr, eventReadyStateChange);
            }
            return true;
          }

          // 调用了 _xhrHook.hook，实现了对网络请求的全面拦截，可以在请求发送前或响应收到后执行额外的操作
          /*
            0, _xhrHook.hook 使用了逗号运算符（,）。
            逗号运算符会先对左边的表达式求值（这里是 0），然后返回右边的表达式（这里是 _xhrHook.hook）。
            整个表达式 (0, _xhrHook.hook) 等价于 _xhrHook.hook，但是它确保了在调用时不会将 this 绑定到 _xhrHook 对象上。
          */
          var _hook = (0, _xhrHook.hook)(
              {
                onload: preventXhrProxyCallback,
                onloadend: preventXhrProxyCallback,
                onerror: errorCallback(eventError),
                ontimeout: errorCallback(eventTimeout),
                onabort: errorCallback(eventAbort),
                onreadystatechange: function onreadystatechange(xhr) {
                  return stateChangeCallback(xhr, this);
                },
                open: function open(args, xhr) {
                  var _this = this;
                  var config = (xhr.config = { headers: {} });
                  config.method = args[0];
                  config.url = args[1];
                  config.async = args[2];
                  config.user = args[3];
                  config.password = args[4];
                  config.xhr = xhr;
                  var evName = "on" + eventReadyStateChange;
                  if (!xhr[evName]) {
                    xhr[evName] = function () {
                      return stateChangeCallback(xhr, _this);
                    };
                  }

                  // 如果有请求拦截器，则在调用onRequest后再打开链接。因为onRequest最佳调用时机是在send前，
                  // 所以我们在send拦截函数中再手动调用open，因此返回true阻止xhr.open调用。
                  //
                  // 如果没有请求拦截器，则不用阻断xhr.open调用
                  if (onRequest) return true;
                },
                send: function send(args, xhr) {
                  var config = xhr.config;
                  config.withCredentials = xhr.withCredentials;
                  config.body = args[0];
                  if (onRequest) {
                    // In 'onRequest', we may call XHR's event handler, such as `xhr.onload`.
                    // However, XHR's event handler may not be set until xhr.send is called in
                    // the user's code, so we use `setTimeout` to avoid this situation
                    var req = function req() {
                      /*
                        onRequest 是当前处理程序，它负责在请求发送前做一些准备工作。
                        new RequestHandler(xhr) 是下一个处理程序，它接手当前请求，并负责发出 HTTP 请求。
                        一般情况：onRequest 逻辑会在 RequestHandler 之前执行，因为 RequestHandler 是作为参数传递进去的，只有在 onRequest 中显式调用时才会执行。
                        特殊情况：如果 onRequest 进行了异步操作，那么 RequestHandler 的执行会被延迟。

                        ajax-hook 的使用示例
                          ah.proxy({
                            onRequest: function (config, handler) {
                              // 修改请求的配置，如增加 headers，或打印日志
                              console.log("Request is being processed:", config);

                              // 执行下一个处理程序，通常是发送请求
                              handler.next(config);
                            }
                          });
                        
                          梳理逻辑rx：send -》 hookFunction -》proxy[fun].call -》proxy.onRequest -> dosomething + handler.next 即 send
                          -> new RequestHandler -> makeHandler(cb) -> new sub -> sub.prototype.nexxt = cb 即 send
                      */
                      onRequest(config, new RequestHandler(xhr)); // 调用下一个处理程序
                    };
                    // 同步请求（async === false）直接调用，异步请求通过 setTimeout 异步调用。
                    config.async === false ? req() : setTimeout(req);
                    return true;
                  }
                },
                setRequestHeader: function setRequestHeader(args, xhr) {
                  // Collect request headers
                  // 将请求头信息保存到 config.headers 中。
                  xhr.config.headers[args[0].toLowerCase()] = args[1];
                  if (onRequest) return true; // 如果存在拦截器，则阻止默认的请求头设置逻辑。
                },
                addEventListener: function addEventListener(args, xhr) {
                  var _this = this;
                  if (_xhrHook.events.indexOf(args[0]) !== -1) {
                    var handler = args[1];
                    getEventTarget(xhr).addEventListener(args[0], function (e) {
                      var event = (0, _xhrHook.configEvent)(e, _this);
                      event.type = args[0];
                      event.isTrusted = true;
                      handler.call(_this, event);
                    });
                    return true;
                  }
                },
                getAllResponseHeaders: function getAllResponseHeaders(_, xhr) {
                  var headers = xhr.resHeader;
                  if (headers) {
                    var header = "";
                    for (var key in headers) {
                      header += key + ": " + headers[key] + "\r\n";
                    }
                    return header;
                  }
                },
                getResponseHeader: function getResponseHeader(args, xhr) {
                  var headers = xhr.resHeader;
                  if (headers) {
                    return headers[(args[0] || "").toLowerCase()];
                  }
                },
              },
              win
            ),
            originXhr = _hook.originXhr,
            unHook = _hook.unHook;

          return {
            originXhr: originXhr,
            unProxy: unHook,
          };
        }

        /***/
      },
      ,
      /* 2 */ /* 3 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.ah = undefined;

        var _xhrHook = __webpack_require__(0);

        var _xhrProxy = __webpack_require__(1);

        // ah(ajax hook)
        /*
         * author: wendux
         * email: 824783146@qq.com
         * source code: https://github.com/wendux/Ajax-hook
         */

        var ah = (exports.ah = {
          proxy: _xhrProxy.proxy,
          hook: _xhrHook.hook,
        });

        /***/
      },
      /******/
    ]
  )
);
