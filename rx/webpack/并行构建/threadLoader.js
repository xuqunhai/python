module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader", "eslint-loader"],
      },
    ],
  },
};
