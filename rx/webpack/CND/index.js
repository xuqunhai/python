// 上传资源到 CDN：例如将 Vue 和 Lodash 上传到 CDN。

// 修改 Webpack 配置，使用 CDN：
// webpack.config.js
module.exports = {
  externals: {
    vue: "Vue", // 使用 Vue 的 CDN 版本
    lodash: "_", // 使用 Lodash 的 CDN 版本
  },
};

// 在 index.html 中引入 CDN 链接：
// <script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
