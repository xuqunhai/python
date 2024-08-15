const HappyPack = require("happypack");

module.exports = {
  // ...
  module: {
    rules: [
      // 将原有 loader 配置替换为 happypack/loader
      {
        test: /\.js$/,
        use: "happypack/loader",
      },
    ],
  },
  plugins: [
    // 创建 happypack 插件实例，并将原有 loader 配置迁移到插件中
    new HappyPack({
      loaders: [
        {
          loader: "babel-loader",
          option: {
            presets: ["@babel/preset-env"],
          },
        },
        "eslint-loader",
      ],
    }),
  ],
};
