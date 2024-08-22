// webpack.config.js
module.exports = {
  entry: {
    page1: "./src/page1.js", // 页面1的入口
    page2: "./src/page2.js", // 页面2的入口
  },
  output: {
    filename: "[name].bundle.js", // 根据入口名称生成不同的 bundle 文件
    path: __dirname + "/dist",
  },
};
