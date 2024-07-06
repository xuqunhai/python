单例模式：确保插件只安装一次（Vue.use 方法）。
function use(plugin) {
if (installedPlugins.has(plugin)) {
return;
}
installedPlugins.add(plugin);
工厂模式：用于创建组件实例（Vue.component / createApp 方法）。
观察者模式：用于实现响应式系统（defineReactive / Proxy 方法）。
装饰器模式：用于添加指令行为（Vue.directive / Composition API 方法）。
策略模式：用于选项合并（optionMergeStrategies）。
中介者模式：通过中介者来管理组件之间的依赖关系。（provide/inject API ）

keep-alive
单例模式
装饰器模式
观察者模式

Vue 插槽
组合模式 通过组合模式实现父子组件之间的灵活组合。
策略模式 根据插槽的名称、作用域等来决定如何渲染插槽内容。

Vue 计算属性
观察者模式
缓存策略
