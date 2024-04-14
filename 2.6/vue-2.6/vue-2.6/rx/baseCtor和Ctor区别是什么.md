# baseCtor

## 定义

- 指的是 Vue.js 的基础构造函数，也就是 Vue 本身。

## 用途

- 创建子组件的构造函数。
- 创建的组件构造函数（即子类）不仅继承了 Vue 实例的基本能力，还能够添加自定义的选项和逻辑。

## 示例

```
const baseCtor = Vue; // Vue 构造函数本身
const SubComponent = baseCtor.extend({
  // 组件选项
});
```

# Ctor

## 定义

- 指向某个具体组件的构造函数，
- 它可能是通过 Vue.extend 创建的，
- 也可能是异步组件的加载结果，
- 或者是直接提供的组件选项对象经过处理后得到的构造函数。

## 用途

- 需要渲染的组件时，会使用这个构造函数来创建组件的实例，并进行初始化和渲染。

## 示例

```
// 通过 Vue.extend 创建的构造函数
const MyComponent = Vue.extend({
  // 组件选项
});
const Ctor = MyComponent;

// 直接作为组件选项提供的情况
const AnotherComponent = {
  // 组件选项
};
// AnotherComponent 在被使用前需要被转换为一个构造函数
```
