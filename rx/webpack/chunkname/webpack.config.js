const path = require('path');
const ChunkNamePlugin = require('./ChunkNamePlugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].js', // 使用 [name] 占位符生成 chunk 文件名
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new ChunkNamePlugin(),
  ],
};
