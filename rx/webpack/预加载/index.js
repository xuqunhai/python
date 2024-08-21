// src/index.js
import(/ webpackPrefetch: true / './moduleA.js').then(moduleA => {
    moduleA.doSomething();
}); 

允许浏览器提前渲染用户可能访问的下一个页面，包括获取所有相关资源并在后台渲染页面。一旦用户导航到该页面，可以实现瞬时加载。兼容性较差
特性检测：通过 JavaScript 进行特性检测，根据浏览器的支持情况动态加载资源。
if ('relList' in document.createElement('link') && document.createElement('link').relList.supports('preload')) {
