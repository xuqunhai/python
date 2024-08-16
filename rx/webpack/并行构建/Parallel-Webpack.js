module.exports = [
  {
    entry: "pageA.js",
    output: {
      path: "./dist",
      filename: "pageA.js",
    },
  },
  {
    entry: "pageB.js",
    output: {
      path: "./dist",
      filename: "pageB.js",
    },
  },
];

// yarn add -D parallel-webpack

// 在 webpack.config.js 配置文件中导出多个 Webpack 配置对象，
// 执行命令 npx parallel-webpack 即可完成构建，

// 上面的示例配置会同时打包出 pageA.js 与 pageB.js 两份产物。
