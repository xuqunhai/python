<template>
  <div>
    <!-- 其他内容 -->

    <!-- 使用 vue-lazy-component 包裹需要懒加载的组件 -->
    <vue-lazy-component :timeout="3000">
      <!-- 1. 缓存当前的组件路径 -->
      <!-- 2. 使用占位符 -->
      <template v-slot:skeleton>
        <div>加载中...</div>
        <!-- 占位内容 -->
      </template>
      <!-- 3. 监听将要看到后再渲染组件 -->
      <heavy-component />
    </vue-lazy-component>
  </div>
</template>

<script>
import HeavyComponent from "./HeavyComponent.vue";

export default {
  components: {
    HeavyComponent,
  },
};
</script>
