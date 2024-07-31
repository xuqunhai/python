const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // 创建 CDP 会话
  const client = await page.target().createCDPSession();

  // 启用网络请求拦截
  await client.send("Network.enable");

  // 存储资源信息
  const resources = [];

  // 监听网络请求事件
  client.on("Network.responseReceived", async (params) => {
    const { response } = params;
    const { url, mimeType, headers } = response;

    if (mimeType.includes("javascript") || mimeType.includes("css")) {
      const requestId = params.requestId;
      const resource = {
        url,
        mimeType,
        headers,
        encodedDataLength: 0,
        decodedBodyLength: 0,
      };

      try {
        // 获取资源大小
        const { body, base64Encoded } = await client.send(
          "Network.getResponseBody",
          { requestId }
        );
        const buffer = Buffer.from(body, base64Encoded ? "base64" : "utf8");
        resource.encodedDataLength = buffer.length;

        // 获取解压缩后的大小
        resource.decodedBodyLength = headers["content-length"] || buffer.length;

        resources.push(resource);
      } catch (error) {
        console.error(`Error getting response body for ${url}:`, error);
      }
    }
  });

  // 导航到目标页面
  try {
    await page.goto(
      "https://salescmscdn.pa18.com/as/kde-newpssp-vue/developClient.html#/home",
      { waitUntil: "networkidle2" }
    );
  } catch (error) {
    console.error("Error during page navigation:", error);
  }

  // 输出资源信息
  console.log(resources);

  await browser.close();
})();
