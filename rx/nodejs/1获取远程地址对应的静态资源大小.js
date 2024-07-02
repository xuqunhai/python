// const http = require('http');
// const https = require('https');
// const zlib = require('zlib');
// const { URL } = require('url');

// // 要获取的远程资源 URL
// const urls = [
//   'https://salescmscdn.pa18.com/as/kde-esalespssp-vue/static/js/chunk-vendors.f4b7c65b.js',
//   'https://salescmscdn.pa18.com/as/kde-common-vue/assets/js/vue/vue.min.js',
//   'https://salescmscdn.pa18.com/as/kde-esalespssp-vue/static/css/chunk-nui.e68762bf.css',
//   'http://salescmscdn.pa18.com/as/kde-esalespssp-vue/static/css/chunk-vendors.c6146e15.css'
// ];
// const urlString = urls[urls.length - 1];

// // 解析 URL，确定使用 http 或 https
// const url = new URL(urlString);
// const protocol = url.protocol === 'https:' ? https : http;

// protocol.get(urlString, (res) => {
//   let rawData = [];
//   let rawSize = 0;

//   // 计算原始大小
//   res.on('data', (chunk) => {
//     rawData.push(chunk);
//     rawSize += chunk.length;
//   });

//   res.on('end', () => {
//     console.log(`Original Size: ${rawSize} bytes`);

//     // 合并所有数据块
//     const buffer = Buffer.concat(rawData);

//     // 计算 gzip 压缩后的大小
//     zlib.gzip(buffer, (err, compressedData) => {
//       if (err) {
//         console.error('Error compressing data:', err);
//         return;
//       }

//       console.log(`Gzipped Size: ${compressedData.length} bytes`);
//     });
//   });
// }).on('error', (err) => {
//   console.error('Error fetching resource:', err);
// });



// 要处理的资源列表
const resources = [
    'https://salescmscdn.pa18.com/as/kde-esalespssp-vue/static/js/chunk-vendors.f4b7c65b.js',
    'https://salescmscdn.pa18.com/as/kde-common-vue/assets/js/vue/vue.min.js',
    'https://salescmscdn.pa18.com/as/kde-esalespssp-vue/static/css/chunk-nui.e68762bf.css',
    'http://salescmscdn.pa18.com/as/kde-esalespssp-vue/static/css/chunk-vendors.c6146e15.css'
  ];
  const http = require('http');
  const https = require('https');
  const zlib = require('zlib');
  const { URL } = require('url');
  
  // 由于 p-limit 包现在是一个 ES Module，而你的代码是用 CommonJS 模块语法编写的。
  // 为了在 CommonJS 模块中使用 ES Module，需要使用动态 import()。
  // 动态导入 p-limit
  async function loadPLimit() {
    const pLimitModule = await import('p-limit');
    return pLimitModule.default;
  }
  
  // 获取资源大小的函数
  async function getResourceSizes(urlString) {
    const url = new URL(urlString);
    const protocol = url.protocol === 'https:' ? https : http;
  
    return new Promise((resolve, reject) => {
      protocol.get(urlString, (res) => {
        let rawData = [];
        let rawSize = 0;
  
        res.on('data', (chunk) => {
          rawData.push(chunk);
          rawSize += chunk.length;
        });
  
        res.on('end', () => {
          const buffer = Buffer.concat(rawData);
          zlib.gzip(buffer, (err, compressedData) => {
            if (err) {
              return reject(err);
            }
            resolve({ url: urlString, originalSize: rawSize, gzippedSize: compressedData.length });
          });
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  
  // 主函数，处理所有资源
  async function processResources(resources) {
    const pLimit = await loadPLimit();
    const limit = pLimit(10); // 例如，限制同时进行的并发请求数量为10
  
    const promises = resources.map(url => limit(() => getResourceSizes(url)));
  
    try {
      const results = await Promise.all(promises);
      results.forEach(result => {
        console.log(`URL: ${result.url}`);
        console.log(`Original Size: ${result.originalSize} bytes`);
        console.log(`Gzipped Size: ${result.gzippedSize} bytes`);
      });
    } catch (err) {
      console.error('Error processing resources:', err);
    }
  }
  
  // 执行主函数
  processResources(resources);
  