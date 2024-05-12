# 数据结构与算法
数据结构与算法基础：LeetCode50 道
前端算法入门、二分、递推、动态规划、栈与队列、线性表、双指针、二叉树、广度优先搜索、深度优先搜索、哈希表、并查集、回溯等

前端算法实战
1. 从算法中看前端

2. TimSort：JavaScript、Java、Python 底层都在使用的排序算法

3. React 底层的链表们（Fiber、Hooks 等）

4. 最小堆：React 中的任务调度算法与任务优先级

5. 前端中的哈希表

6. 哈希表与 Vue keep-alive LRU 算法

7. 编译原理入门

8. 编译原理在前端的应用

9. 前端中的位运算

10. 事件循环

11. 前端加密算法


# 前端工程化
总述 & 基础
1. 脚手架、工具链

2. NPM 包管理器

3. 脚手架与 CLI

4. 开发规范、ESLint、Prettier

5. Polyfill 与浏览器兼容性

6. Jest 单元测试

7. 断点与调试工具

8. 代码覆盖率

9. 持续集成 CI/CD

10. Babel 语法编译与转义

原理
1. webpack 手写原理

Bundle 结构解析

Babel 与 AST 语法树

模块依赖分析

递归获取依赖

处理 require 关键字

处理 exports 关键字

2. Vite 手写原理

Bundle 与 Bundless 区别

实现第三方库支持

实现 Vue 单文件支持

实现 CSS 文件支持

3. 手写 CLI 原理

实操
1. Rollup 组件库搭建

2. 基于 Vite 的黑魔法实操：Admin

3. webpack 优化实操

# 前端架构
组件化基础理论
1. 手势

2. I18n

3. 容器

4. 无外壳

5. 快捷键与焦点

6. 可访问性

Vue 全家桶源码
1. Vue 源码剖析

Vue3 整体架构

源码调试环境搭建

源码学习方法演示

初始化流程剖析

数据响应式原理

异步更新策略

更新流程和 patch 算法剖析

编译器原理及优化策略

Composition API 原理探究

Reactivity API 原理探究

2. 手写 mini-vue

创建 App 实例 createApp()

根组件实例挂载 mount()

视图初始构建：首次 patch()

数据响应式：reactive()

依赖收集：ReactiveEffect

更新机制：setupRenderEffect()

视图更新：patch 算法

3. 手写 mini-router

创建 Router 实例：createRouter()

Router 类定义

定义 Router 插件

实现 RouterView 组件

实现 RouterLink 组件

路由监听和响应

路由匹配和渲染

4. 手写 mini-vuex

创建 Store 实例：createStore()

Store 定义

定义 Vuex 插件

state 响应式处理

实现 mutation 和 action

实现 getters

5. 手写 mini-pinia

Vue3 组件库实操
1. 项目架构

2. 文档系统

3. 组件测试

4. 打包发布

5. 组件库 CLI

6. 数据展示：树

7. 数据展示：表格

8. 数据录入：表单

9. 数据录入：输入框

10. 导航：页签

11. 导航：面包屑

12. 反馈：模态窗

13. 反馈：悬浮提示

14. 反馈：进度条

15. 轮播图

React 全家桶源码
1. 手写 Mini React

2. React18 源码剖析

3. 手写实现三种 Form 解决方案：HOC（Antd3 Form）、Hooks（Antd4 Form）、响应式（Formily2）

4. 手写 Redux、React-Redux、Redux-Saga、Redux-Thunk、Redux-Promise、Redux-Logger

5. 手写 React-Router6

6. React 异步解决方案

7. Umi 4 / Dva 核心源码解析

8. 手写 MobX 6、Mobx-React、Mobx-React-Lite

9. Recoil 源码解析