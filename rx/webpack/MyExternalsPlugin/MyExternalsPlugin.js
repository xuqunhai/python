class MyExternalsPlugin {
  constructor(externals) {
    this.externals = externals;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('MyExternalsPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.factory.tap('MyExternalsPlugin', (factory) => {
        return (data, callback) => {
          const request = data.request;
          
          // 检查请求是否在 externals 配置中
          if (this.externals[request]) {
            return callback(null, {
              // 模拟外部模块的处理
              request,
              external: true,
              userRequest: request,
              rawRequest: request,
              resource: request,
              loaders: [],
              parser: null,
              resourceResolveData: {},
              context: data.context,
            });
          }
          
          // 继续正常的模块解析
          factory(data, callback);
        };
      });
    });

    // 处理打包时的外部模块
    compiler.hooks.compilation.tap('MyExternalsPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('MyExternalsPlugin', (chunks, callback) => {
        chunks.forEach(chunk => {
          chunk.getModules().forEach(module => {
            if (module.external) {
              const source = `module.exports = ${this.externals[module.request]}`;
              module._source = {
                source: () => source,
                size: () => source.length,
              };
            }
          });
        });
        callback();
      });
    });
  }
}

module.exports = MyExternalsPlugin;
