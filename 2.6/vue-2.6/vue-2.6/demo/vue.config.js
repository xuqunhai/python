config.optimization = {
  splitChunks: {
    cacheGroups: {
      common: {
        name: "chunk-common",
        chunks: "all",
        minChunks: 6,
        minSize: 0,
        priority: 1,
        reuseExistingChunk: true,
        enforce: true,
      },
      betterScroll: {
        name: "better-scroll",
        test: /[\\/]node_modules[\\/]better-scroll[\\/]/,
        chunks: "all",
        priority: 14,
        reuseExistingChunk: true,
        enforce: true,
      },
      html2canvas: {
        name: "html2canvas",
        test: /[\\/]node_modules[\\/]html2canvas[\\/]/,
        chunks: "all",
        priority: 14,
        reuseExistingChunk: true,
        enforce: true,
      },
      localforage: {
        name: "localforage",
        test: /[\\/]node_modules[\\/]localforage[\\/]dist[\\/]/,
        chunks: "all",
        priority: 14,
        reuseExistingChunk: true,
        enforce: true,
      },
    },
  },
};
