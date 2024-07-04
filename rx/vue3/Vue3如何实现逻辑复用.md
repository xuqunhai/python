# Vue3 如何实现逻辑复用

- 因为 setup 函数会在组件实例创建时被调用，并且返回的数据会绑定到模板和组件实例上，所以在一个组件中只能定义一个 setup 函数。
- 如果需要在组件中复用逻辑，可以使用组合式函数。

```
import { ref, onMounted } from 'vue';

// 定义一个组合式函数
function useMessage() {
  const message = ref('Hello Vue 3!');

  onMounted(() => {
    console.log('Mounted - message:', message.value);
  });

  return {
    message
  };
}

function useCount() {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return {
    count,
    increment
  };
}

export default {
  setup() {
    // 在 setup 函数中调用组合式函数
    const { message } = useMessage();
    const { count, increment } = useCount();

    return {
      message,
      count,
      increment
    };
  }
};
```
