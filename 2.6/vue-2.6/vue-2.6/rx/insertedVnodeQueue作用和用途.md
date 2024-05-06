# insertedVnodeQueue 是什么

- 它是一个队列，用于存储在当前渲染过程中已经插入到 DOM 中的所有虚拟节点（VNodes）。
- 这个队列主要用于在渲染过程完成后，统一执行这些 VNodes 相关的插入钩子函数。

# 实现机制

- 在 Vue 的渲染过程中，每当一个组件或元素被插入到 DOM 中时，相应的 VNode 就会被添加到 insertedVnodeQueue 中。
- 一旦整个视图更新完毕，Vue 将遍历这个队列，按顺序执行每个 VNode 的 mounted 钩子以及其他相关的插入钩子。

# 示例：当父组件和子组件被渲染时：

- 子组件的 VNode 首先被创建并插入到 DOM 中，随后其 mounted 钩子需要被调用。
- 子组件的 VNode 被添加到 insertedVnodeQueue。
- 父组件的 VNode 接着被处理，并且其 mounted 钩子也将被触发。
- 在渲染周期的最后，insertedVnodeQueue 中的所有 VNode 的 mounted 钩子会被调用，确保所有组件都正确地响应了它们的生命周期事件。
