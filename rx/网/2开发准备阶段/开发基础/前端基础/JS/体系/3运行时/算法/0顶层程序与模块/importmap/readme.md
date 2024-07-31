# <script type="module">

- 模块化支持：允许 JavaScript 文件作为模块使用，支持 ES6 模块导入和导出。
- 作用域独立：模块有自己的作用域，不会污染全局作用域。
- 异步加载：模块脚本是异步加载的，浏览器会并行下载模块及其依赖。

# <script type="importmap">

- 管理模块映射：允许定义模块标识符与实际文件路径之间的映射关系。
- 简化导入路径：简化模块导入路径，避免使用长路径或相对路径。

# 如何检查浏览器支持

可以使用浏览器的开发者工具查看是否支持 Import Maps。例如，在 Chrome 中：

- 打开开发者工具。
- 切换到 "Console" 标签。
- 输入 import.meta 并查看是否有相关支持信息。

# 使用 Polyfill 兼容旧浏览器

- 如果需要在不支持 Import Maps 的浏览器中使用，可以使用 Polyfill。例如，使用 es-module-shims：
