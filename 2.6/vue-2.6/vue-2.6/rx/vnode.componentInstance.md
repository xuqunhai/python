# vnode.componentInstance 是什么

- 是 Vue 组件实例的引用，存储在表示该组件的虚拟节点上。这个实例包含了组件的所有状态（如数据、计算属性等）和行为（如方法、生命周期钩子等），并且是 Vue 响应式系统的活跃部分。
- vnode.componentInstance 是 Vue 中虚拟节点与其对应的组件实例之间的桥梁。
- 它在组件的创建、更新、异步加载等关键时刻被赋值和管理

# 何时 vnode.componentInstance 有值

- 组件创建时：当 Vue 渲染一个组件时，它首先解析组件的定义和选项，创建一个新的 Vue 实例。并且 componentInstance 属性被设置为这个新创建的 Vue 实例。
- 组件更新时：如果组件本身没有发生任何根本的改变（如组件类型未变），则 Vue 会重用旧的组件实例，并更新其数据和属性。在这种情况下，新的组件 VNode 会继续使用与旧 VNode 相同的 componentInstance。
- 异步组件加载完成时：在异步组件的场景下，组件的定义可能在初次渲染时不可用，Vue 需要等待组件代码被加载和解析后，才能创建实例并赋值给 componentInstance。
