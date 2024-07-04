# watchPostEffect

- 与 watch 和 watchEffect 不同的是，watchPostEffect 确保副作用在 DOM 更新完成后执行。
- 作用和应用场景
  1.  当你需要在响应式数据变化后，操作更新后的 DOM 元素，例如获取元素的尺寸或位置。
  2.  当副作用依赖于最新的 DOM 布局和样式计算结果，例如计算滚动位置、元素高度等。
  3.  确保副作用在 DOM 更新完成后执行，避免多次更新导致的不必要的重复计算。

# 有一个列表，需要在每次更新后滚动到最后一项：

```
<template>
  <div ref="listContainer" class="list-container">
    <div v-for="item in items" :key="item.id">{{ item.text }}</div>
  </div>
</template>

<script>
import { ref, watchPostEffect } from 'vue';

export default {
  setup() {
    const items = ref([
      { id: 1, text: 'Item 1' },
      { id: 2, text: 'Item 2' },
      { id: 3, text: 'Item 3' }
    ]);

    const listContainer = ref(null);

    watchPostEffect(() => {
      if (listContainer.value) {
        listContainer.value.scrollTop = listContainer.value.scrollHeight;
      }
    });

    // 模拟数据更新
    setTimeout(() => {
      items.value.push({ id: 4, text: 'Item 4' });
    }, 2000);

    return {
      items,
      listContainer
    };
  }
};
</script>

<style>
.list-container {
  max-height: 100px;
  overflow-y: auto;
}
</style>

```

# 在每次更新后计算一个元素的高度

```
<template>
  <div ref="content" class="content">
    <p v-for="item in items" :key="item.id">{{ item.text }}</p>
  </div>
</template>

<script>
import { ref, watchPostEffect } from 'vue';

export default {
  setup() {
    const items = ref([
      { id: 1, text: 'Item 1' },
      { id: 2, text: 'Item 2' },
      { id: 3, text: 'Item 3' }
    ]);

    const content = ref(null);
    const contentHeight = ref(0);

    watchPostEffect(() => {
      if (content.value) {
        contentHeight.value = content.value.offsetHeight;
        console.log('Content height:', contentHeight.value);
      }
    });

    // 模拟数据更新
    setTimeout(() => {
      items.value.push({ id: 4, text: 'Item 4' });
    }, 2000);

    return {
      items,
      content,
      contentHeight
    };
  }
};
</script>

<style>
.content {
  border: 1px solid #000;
  padding: 10px;
}
</style>
```
