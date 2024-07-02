function collectPerformanceMetrics() {
  window.addEventListener('load', () => {
    // 完整页面加载时间
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page Load Time: ${loadTime} ms`);

    // 资源加载时间
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
      console.log(`Resource: ${resource.name}, Load Time: ${resource.responseEnd - resource.startTime} ms`);
    });

    // DNS 查询时间
    const dnsTime = performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
    console.log(`DNS Lookup Time: ${dnsTime} ms`);

    // TCP 连接时间
    const tcpTime = performance.timing.connectEnd - performance.timing.connectStart;
    console.log(`TCP Connect Time: ${tcpTime} ms`);

    // HTTPS 握手时间
    const sslTime = performance.timing.connectEnd - performance.timing.secureConnectionStart;
    console.log(`SSL Handshake Time: ${sslTime} ms`);

    // 首字节时间（TTFB）
    const ttfb = performance.timing.responseStart - performance.timing.requestStart;
    console.log(`Time to First Byte (TTFB): ${ttfb} ms`);

    // 内存使用情况
    if (performance.memory) {
      console.log(`JS Heap Size Limit: ${performance.memory.jsHeapSizeLimit} bytes`);
      console.log(`Total JS Heap Size: ${performance.memory.totalJSHeapSize} bytes`);
      console.log(`Used JS Heap Size: ${performance.memory.usedJSHeapSize} bytes`);
    }

    // 简单的 CPU 使用情况测量
    function measureCPU() {
      const startTime = performance.now();
      for (let i = 0; i < 1e6; i++) {
        // 模拟 CPU 密集型操作
      }
      const endTime = performance.now();
      console.log(`CPU Intensive Task Time: ${endTime - startTime} ms`);
    }

    measureCPU();
  });

  // 首屏渲染时间
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
      console.log(`First Contentful Paint: ${entry.startTime} ms`);
    }
  }).observe({ type: 'paint', buffered: true });

  // 页面交互响应时间
  window.addEventListener('DOMContentLoaded', () => {
    const domContentLoadedTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`DOM Content Loaded Time: ${domContentLoadedTime} ms`);
  });
}

// 执行性能采集
collectPerformanceMetrics();
