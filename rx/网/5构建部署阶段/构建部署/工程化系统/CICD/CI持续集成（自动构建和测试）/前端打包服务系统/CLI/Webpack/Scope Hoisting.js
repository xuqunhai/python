/*
背景： Scope Hoisting 是一种通过将模块打包到闭包中以减少闭包数量的技术，从而提高运行时性能和减少包体积。
效果： 通过将所有模块提升到一个更大的闭包中，Webpack 4 减少了闭包的数量，从而减少了包的体积，并且在运行时减少了函数调用的开销，提高了代码执行速度。
*/

/*
普通打包（未应用作用域提升）
在没有作用域提升的情况下，每个模块会被包装在一个单独的函数闭包中。例如，假设我们有两个简单的模块：

// module1.js
export const greet = () => {
  console.log("Hello from module1");
};

// module2.js
import { greet } from './module1';
greet();
*/

// 普通打包后的代码可能如下：
// 这里每个模块都被包装在一个函数闭包中，导致函数调用开销和更大的包体积。
(function(modules) {
  function __webpack_require__(moduleId) {
    var module = {
      exports: {}
    };
    modules[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }

  return __webpack_require__("./src/index.js");
})({
  "./src/index.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _module1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/module1.js");
    _module1__WEBPACK_IMPORTED_MODULE_0__.greet();
  }),
  "./src/module1.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "greet": function() { return greet; }
    });
    const greet = () => {
      console.log("Hello from module1");
    };
  })
});

/*
应用作用域提升的打包
通过作用域提升，Webpack 会尝试将所有模块提升到一个更大的闭包中，从而减少函数包装的数量：
*/
// Webpack 将所有模块的定义提升到一个更大的闭包中，而不是为每个模块单独创建一个函数闭包。这减少了闭包的数量和函数调用的开销，从而减小了包的体积并提高了代码的执行效率。
(function() {
  "use strict";
  var __webpack_modules__ = {
    "./src/module1.js": (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        "greet": function() { return greet; }
      });
      const greet = () => {
        console.log("Hello from module1");
      };
    })
  };

  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }

  __webpack_require__.r = (exports) => {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  __webpack_require__.d = (exports, definition) => {
    for(var key in definition) {
      if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };

  var __webpack_exports__ = {};
  !function() {
    var _module1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/module1.js");
    _module1__WEBPACK_IMPORTED_MODULE_0__.greet();
  }();
})();
