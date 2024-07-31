const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    // executablePath: `C:\Program Files\Google\Chrome Dev\Application\chrome.exe`,?\
  });
  const page = await browser.newPage();
  await page.goto("https://y.qq.com");
  await page.screenshot({ path: "yqq.png" });
  browser.close();
})();
