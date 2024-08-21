// webpack.config.js
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true }, // 移除 console 语句
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
