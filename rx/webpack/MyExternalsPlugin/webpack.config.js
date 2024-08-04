const path = require('path');
const MyExternalsPlugin = require('./MyExternalsPlugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    new MyExternalsPlugin({
      jquery: 'jQuery', // 将 jQuery 标记为外部依赖
    }),
  ],
};
