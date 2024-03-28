module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
      // 其他规则...
    ]
  },
  plugins: [
    // Vue Loader 插件
    new VueLoaderPlugin()
  ]
  // 其他配置...
}
