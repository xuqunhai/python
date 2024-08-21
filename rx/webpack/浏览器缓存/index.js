// 配置 Webpack 为打包的文件添加文件 hash，确保资源变动时可以更新缓存。
// // webpack.config.js
// module.exports = {
//     output: {
//       filename: '[name].[contenthash].js', // 通过 hash 生成唯一文件名
//       chunkFilename: '[name].[contenthash].js',
//     }
//   };

// 设置服务器的缓存控制策略。
// 服务器配置：设置 Cache-Control：
// Nginx 配置示例：
// location ~* \.(js|css|png|jpg|jpeg|gif|svg)$ {
//     expires 1y;
//     add_header Cache-Control "public";
//   }
