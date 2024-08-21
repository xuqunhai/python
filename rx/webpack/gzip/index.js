// npm install compression-webpack-plugin --save-dev
// webpack.config.js
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  plugins: [
    new CompressionWebpackPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/, // 需要压缩的文件类型
      threshold: 10240, // 文件大于 10k 才进行压缩
      minRatio: 0.8, // 最小压缩比率
    }),
  ],
};
