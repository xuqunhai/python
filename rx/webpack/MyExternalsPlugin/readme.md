npm install --save-dev webpack webpack-cli
npx webpack

解释
normalModuleFactory.hooks.factory：这个钩子在模块工厂创建模块实例之前触发。我们在这里检查请求是否在 externals 配置中，如果是，则标记为外部模块。
compilation.hooks.optimizeChunkAssets：这个钩子在优化 chunk 资产时触发。我们在这里替换外部模块的内容为导出对应的全局变量。