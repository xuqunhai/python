### 六、进阶优化技巧

#### 1. 使用服务端渲染（SSR）

##### 1.1 工作要点

- **SSR 的原理和优势**（10 分钟）
  - 服务端渲染（SSR）是在服务器上生成页面的 HTML 内容，然后发送到客户端，这样可以减少客户端的渲染时间，提升页面加载速度。
  - **优势**：
    - 提高首屏加载速度，改善用户体验
    - 对 SEO 友好，搜索引擎可以更好地抓取页面内容
    - 减少客户端的渲染压力

##### 1.2 工作方法

- **使用 Nuxt.js 实现 SSR**（15 分钟）
  - **示例代码**：在 Nuxt.js 项目中启用 SSR
    ```javascript
    // nuxt.config.js
    export default {
      mode: "universal", // 'universal' 模式启用 SSR
      head: {
        title: "My Nuxt.js SSR Project",
        meta: [
          { charset: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          {
            hid: "description",
            name: "description",
            content: "My Nuxt.js SSR project",
          },
        ],
      },
      buildModules: [
        // https://go.nuxtjs.dev/typescript
        "@nuxt/typescript-build",
      ],
      modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
      ],
      axios: {},
      build: {
        extend(config, ctx) {},
      },
    };
    ```
  - **解释**：
    - `mode: 'universal'` 启用 SSR 模式，使得 Nuxt.js 在服务器端渲染页面。

##### 1.3 常用问题与解决思路

- **SSR 中的常见问题及解决方案**（10 分钟）

  - **问题**：首次渲染时间较长
  - **解决方案**：

    - **使用缓存**：在服务器端对渲染结果进行缓存，减少重复渲染的开销。

      - **示例代码**：使用 Redis 缓存 SSR 结果

        ```javascript
        const express = require("express");
        const { createBundleRenderer } = require("vue-server-renderer");
        const Redis = require("ioredis");
        const redis = new Redis();

        const server = express();
        const renderer = createBundleRenderer(bundle, {
          runInNewContext: false,
          template,
        });

        server.get("*", async (req, res) => {
          const key = `ssr:${req.url}`;
          const cachedPage = await redis.get(key);
          if (cachedPage) {
            res.send(cachedPage);
          } else {
            renderer.renderToString({ url: req.url }, (err, html) => {
              if (err) {
                res.status(500).end("Internal Server Error");
                return;
              }
              redis.set(key, html, "EX", 3600); // 缓存一小时
              res.send(html);
            });
          }
        });

        server.listen(8080);
        ```

#### 2. PWA（Progressive Web App）优化

##### 2.1 工作要点

- **PWA 的特点和优势**（10 分钟）
  - PWA 结合了 Web 应用和本地应用的优势，提供了离线访问、推送通知和安装到主屏幕等功能，提升用户体验和参与度。
  - **优势**：
    - 提供离线访问能力
    - 支持推送通知，提升用户参与度
    - 可安装到主屏幕，增加用户留存

##### 2.2 工作方法

- **实现离线缓存和推送通知**（15 分钟）

  - **示例代码**：使用 Service Worker 实现离线缓存

    ```javascript
    // sw.js
    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open("v1").then((cache) => {
          return cache.addAll([
            "/",
            "/index.html",
            "/styles.css",
            "/script.js",
          ]);
        })
      );
    });

    self.addEventListener("fetch", (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    });
    ```

  - **示例代码**：实现推送通知

    ```javascript
    // main.js
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then((swReg) => {
        console.log("Service Worker is registered", swReg);
      });
    }

    function subscribeUser() {
      navigator.serviceWorker.ready.then((swReg) => {
        swReg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              "YOUR_PUBLIC_VAPID_KEY"
            ),
          })
          .then((subscription) => {
            console.log("User is subscribed:", subscription);
          });
      });
    }
    ```

##### 2.3 常用问题与解决思路

- **PWA 优化中的常见问题及解决方案**（10 分钟）

  - **问题**：离线缓存更新不及时
  - **解决方案**：

    - **版本控制**：为缓存的资源添加版本号，确保及时更新。

      - **示例代码**：在 Service Worker 中实现缓存更新

        ```javascript
        const CACHE_NAME = "my-site-cache-v1";
        const urlsToCache = ["/", "/index.html", "/styles.css", "/script.js"];

        self.addEventListener("install", (event) => {
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
              return cache.addAll(urlsToCache);
            })
          );
        });

        self.addEventListener("activate", (event) => {
          const cacheWhitelist = [CACHE_NAME];
          event.waitUntil(
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                  }
                })
              );
            })
          );
        });

        self.addEventListener("fetch", (event) => {
          event.respondWith(
            caches.match(event.request).then((response) => {
              if (response) {
                return response;
              }
              return fetch(event.request);
            })
          );
        });
        ```

### 课程结构：

- **使用服务端渲染（SSR）**（35 分钟）
  - 介绍 SSR 的原理和优势
  - 提供使用 Nuxt.js 实现 SSR 的具体步骤和示例代码
  - 讨论 SSR 中的常见问题及解决方案，包括缓存策略
- **PWA（Progressive Web App）优化**（35 分钟）
  - 讲解 PWA 的特点和优势
  - 提供实现离线缓存和推送通知的具体实现和示例代码
  - 分析 PWA 优化中的常见问题及解决方案

这部分课程大约为 70 分钟。请确认这部分内容是否符合要求，如果需要调整或补充，请告知。确认后我们继续制作下一章节的内容。
