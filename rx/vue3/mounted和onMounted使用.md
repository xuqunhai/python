# 有效的写法：

- 选项式 API 和组合式 API 混合使用：

```
export default {
  setup() {
    const message = ref('Hello Vue 3!');
    return { message };
  },
  mounted() {
    console.log('mounted - message:', this.message);
  }
};

```

- 仅使用组合式 API：

```
export default {
  setup() {
    const message = ref('Hello Vue 3!');

    onMounted(() => {
      console.log('mounted - message:', message.value);
    });

    return {
      message
    };
  }
};
```
