# 常用的 app.config 属性和方法

- errorHandler:全局错误处理器，用于捕获并处理所有组件中的错误。

```
app.config.errorHandler = (err, vm, info) => {
  console.error(`Error: ${err.toString()}\nInfo: ${info}`);
};
```

- globalProperties:用于向应用实例添加全局属性，这些属性在所有组件实例中都可以通过 this 访问。

```
app.config.globalProperties.$http = axios;
// 组件中可以通过 this.$http 访问 axios 实例
```

- isCustomElement:自定义元素的检测函数，用于告诉 Vue 某些标签是自定义元素，不应该被 Vue 解析为组件。

```
app.config.isCustomElement = tag => tag.startsWith('custom-');
```

- performance:启用性能追踪，在开发模式下默认关闭。设置为 true 可以启用。

```
app.config.performance = true;
```
