# Vue 3 组合式 API 的核心部分

- reactive：用于创建响应式对象。
- computed：用于创建计算属性。
- watch 和 watchEffect：用于观察和响应数据变化。
- onMounted、onUnmounted、onUpdated 等生命周期钩子。
- defineComponent：用于定义一个 Vue 组件。
- provide 和 inject：用于在组件之间共享数据。
- h：用于创建虚拟 DOM 节点。
- nextTick：用于在下次 DOM 更新后执行某个回调函数。
- toRefs、toRef：将响应式对象转换为响应式引用。
- useRoute 和 useRouter：如果使用 Vue Router，则用于获取路由对象和路由器实例。

```
import {
  createApp,
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  defineComponent
} from 'vue';
```

# createApp 的主要作用

- 两个参数:
  1.  rootComponent：必需。根组件，通常是一个对象，包含模板、数据、方法等。
  2.  rootProps：可选。根组件的属性，是一个对象，这些属性会传递给根组件。

```
const app = createApp(App, { someProp: 'someValue' });
```

- 返回值
  - 返回一个应用实例，管理整个 Vue 应用的生命周期、组件树、状态管理等。该实例提供了一些方法用于配置和管理整个应用
    - app.mount：将应用挂载到 DOM 元素。
    - app.component：注册全局组件。
    - app.directive：注册全局指令。
    - app.use：注册插件。
    - app.config：应用的全局配置。

# 应用挂载详细过程

- 查找 DOM 元素：
- 创建虚拟 DOM：模板编译
- 虚拟 DOM 转换为实际 DOM：
- 插入到挂载点：

# 虚拟 DOM 和组件树的关系

- 组件树：描述了组件的结构和关系。
- 虚拟 DOM：描述了每个组件的模板在某一时刻的状态。
- Vue 实例：管理组件树和虚拟 DOM，负责将组件树的变化反映到虚拟 DOM，并将虚拟 DOM 的变化反映到实际 DOM。

```
// 简单的组件结构：
// App.vue
<template>
  <div>
    <Header />
    <Content />
  </div>
</template>

<script>
import Header from './Header.vue';
import Content from './Content.vue';

export default {
  components: {
    Header,
    Content
  }
};
</script>

// 组件树
App
├── Header
└── Content

// 虚拟 DOM 树
{
  tag: 'div',
  children: [
    {
      tag: 'Header',
      children: []
    },
    {
      tag: 'Content',
      children: []
    }
  ]
}

```

# 虚拟 DOM 的优点

- 性能优化：通过 diff 算法，Vue 可以只更新需要更新的部分，避免不必要的 DOM 操作。
- 跨平台：虚拟 DOM 是平台无关的，可以用于服务器端渲染和其他渲染目标（如 Weex）。

# ref 和 reactive 的区别

- ref：

  - Vue 3：用于基本类型和单个变量，具有 .value 属性。
  - Vue 2：没有直接对应的 API，可以通过 data 实现类似功能。

- reactive：
  - Vue 3：用于复杂数据结构，创建深层次响应式代理。
  - Vue 2：通过 data 实现响应式对象，但没有 reactive 的深层次代理功能。

# watch 和 watchEffect 的区别

- watch：
  - 用途：用于观察特定的响应式数据，当数据变化时执行副作用。
  - 使用场景：需要精确控制要观察的数据或进行异步操作时。
  - 实现方式：接收两个参数，第一个参数是要观察的数据，第二个参数是回调函数。
- watchEffect：

  - 用途：用于立即执行传入的函数，并在其依赖的响应式数据变化时再次执行。
  - 使用场景：用于需要自动跟踪依赖的场景，不需要明确指定依赖的数据。
  - 实现方式：接收一个函数，该函数会立即执行，并自动收集其依赖的响应式数据。

# watchEffect 和 computed,有什么区别？

- computed：适用于需要自动计算并缓存结果的场景，例如动态计算属性、基于状态的派生数据等。
- watchEffect：适用于需要响应数据变化并执行副作用的场景，例如监控数据变化、触发外部操作等。

# defineComponent 的作用和使用

- Vue 3 defineComponent：专为 TypeScript 设计，提供更好的类型推断和开发体验，也适用于 JavaScript 项目，提升代码一致性。
- Vue 2 Vue.extend：用于扩展 Vue 实例，定义组件，适合大型项目，但需要引入 Vue 核心库。
- 直接定义组件对象：Vue 2 和 Vue 3 都支持，简单直接，适合小型项目或简单组件。

# Vue 3 中，export default defineComponent({}) 和 export default {} 的区别

- 类型推断：defineComponent：提供更好的类型推断，特别是与 TypeScript 一起使用时。
- 语义和明确性：defineComponent：明确表明这是一个组件定义，语义更清晰。
- 代码一致性：defineComponent：推荐在大型项目或团队协作中使用，确保代码风格和定义方式一致。

# toRefs 和 toRef 的区别

- toRef：使用场景：适用于对单个属性进行响应式处理。
- toRefs：使用场景：适用于对整个对象的所有属性进行响应式处理，特别是在解构时。

# useRoute 和 useRouter 的区别

- useRoute：使用场景：适用于需要访问当前路由信息的场景，例如获取路由参数、查询字符串等。
- useRouter：使用场景：适用于需要进行路由导航的场景，例如编程式导航、动态修改路由配置等。

# Vue3 的 setup(){}函数和<script setup>有什么区别？

- <script setup> 是一种更简洁的语法糖，用于定义组件的逻辑和状态。
- 它将 setup 函数的逻辑直接放在 <script setup> 标签内，不需要显式地定义 setup 函数。
- 模板中可以直接使用定义的变量和函数，无需显式返回。
- <script setup>：由于在编译阶段进行优化，它在性能上稍微有优势。
