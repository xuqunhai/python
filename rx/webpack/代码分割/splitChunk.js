module.exports = {
  common: {
    name: "chunk-common", // 指定拆分出来的 chunk 的名称
    chunks: "all", // 对所有模块进行拆分，包括同步和异步模块。
    minChunks: 5, // 至少被引用 5 次的模块才会被拆分到这个 chunk 中。
    priority: 2, // 较低的优先级，表示只有其他高优先级的规则不匹配时，才会应用这个规则。
    reuseExistingChunk: true, // 重用这个现有的 chunk，而不是创建一个新的。
    enforce: true, // 保留强制执行，确保这些公共模块和第三方库被拆分。
  },
  commons: {
    name: "common",
    test: /[\\/]src[\\/]common[\\/]/,
    chunks: "all",
    minChunks: 2,
    priority: -10,
  },
  vendor: {
    name: "vendors",
    test: /[\\/]node_modules[\\/]/,
    chunks: "all",
    priority: -10,
  },
  vendors: {
    name: "chunk-vendors",
    test: /[\\/]node_modules[\\/]/,
    chunks: "all",
    priority: 2,
    reuseExistingChunk: true,
    enforce: true,
  },
  highUsageLib: {
    name: "highUsageLib",
    test: /[\\/]src[\\/]lib[\\/highUsageLib[\\/]/,
    chunks: "all",
    priority: 20,
    enforce: true,
  },
  betterScroll: {
    name: "better-scroll",
    test: /[\\/]node_modules[\\/better-scroll[\\/]/,
    chunks: "all",
    priority: 14,
    reuseExistingChunk: true,
  },
  splitChunks: {
    chunks: "async", // 只拆分异步加载的模块
    minSize: 30000, // 模块最小尺寸，超过该尺寸才进行分割
    maxAsyncRequests: 5, // 异步加载时最大的并行请求数量
    maxInitialRequests: 3, // 入口点的最大并行请求数量
    automaticNameDelimiter: "~", // 分割文件名称的连接符
  },
  quill: {
    name: "quill",
    test: /[\\/]node_modules[\\/quill[\\/]/,
    chunks: "async", // 仅对异步加载的 quill 模块进行拆分
    priority: 12, // 较低优先级，避免错误分配
    reuseExistingChunk: true,
  },
};
// 适用于需要将常用模块（引用次数较多）拆分成一个独立的 chunk，方便浏览器缓存和减少重复加载的场景。
