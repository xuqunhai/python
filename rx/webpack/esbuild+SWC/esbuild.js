module.exports = {
  rule: [
    {
      test: /.js$/,
      loader: "esbuild-loader", // esbuild esbuild-loader
      options: {
        loader: "js",
        target: "es2015",
      },
    },
    {
      test: /.js$/,
      loader: "swc-loader", //  @swc/core swc-loader
      options: {
        jsc: {
          parser: {
            syntax: "ecmascript",
          },
          target: "es2015",
        },
      },
    },
  ],
};
