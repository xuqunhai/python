class ChunkNamePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('ChunkNamePlugin', (compilation) => {
      compilation.hooks.beforeModuleIds.tap('ChunkNamePlugin', (modules) => {
        modules.forEach((module) => {
          if (module.type === 'javascript/auto' && module._source) {
            const source = module._source._value;
            const chunkNameMatch = source.match(/webpackChunkName:\s*"(.+?)"/);
            if (chunkNameMatch) {
              const chunkName = chunkNameMatch[1];
              module.chunkName = chunkName;
            }
          }
        });
      });

      compilation.hooks.afterOptimizeChunkIds.tap('ChunkNamePlugin', (chunks) => {
        chunks.forEach((chunk) => {
          if (chunk.name === null && chunk.modulesIterable) {
            for (const module of chunk.modulesIterable) {
              if (module.chunkName) {
                chunk.name = module.chunkName;
                break;
              }
            }
          }
        });
      });
    });
  }
}

module.exports = ChunkNamePlugin;
