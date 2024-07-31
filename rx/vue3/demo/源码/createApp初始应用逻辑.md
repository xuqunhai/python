# createApp 函数都做了什么

## 怎么使用 createApp

```
const { createApp } = Vue

const app = createApp({
  template: '<h1>hello</h1>'
})

app.mount('#app')
```

## 在那里定义 createApp

- createApp 方法来自于 packages/runtime-dom 包中
- runtime-dom 的运行依赖于 runtime-core 包, 所以在 runtime-dom/src/index.ts 模块中一定会引入 runtime-core 包
- createApp 接收两个入参:
  - 根组件: 根组件可以是单文件组件, 也可以是组件的选项对象
  - props: 向根组件传入的 props 数据, 该参数为可选参数.

```
import { /.../ } from '@vue/runtime-core'


// 创建 vue 应用API
export const createApp = ((...args) => { // 通过...args剩余运算符收集所有入参, 将参数组合成为数组.
  // 1. 首先创建应用
  const app = ensureRenderer().createApp(...args)

  // 2. 重写mount 方法
  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // ...后面分析
  }

  //3.返回应用
  return app
}) as CreateAppFunction<Element>
```

## ensureRenderer 怎么定义

```
// Renderer 为Web前端渲染器 , HydrationRenderer为SSR服务器端渲染使用，
let renderer: Renderer<Element | ShadowRoot> | HydrationRenderer

function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  )
}
```

## rendererOptions 实现

```
// 渲染器配置对象
const rendererOptions = /*#__PURE__*/ extend({ patchProp }, nodeOps)
// patchProp：是 Vue 3 渲染器中处理属性和事件更新的函数。它负责将 VNode 的变化更新到实际的 DOM 元素上。
// nodeOps：定义了一组基础的 DOM 操作，用于创建和操作 DOM 节点。
// 通过 extend 函数将它们合并在一起，创建一个完整的渲染器选项对象。

// extend 就是合并对象的方法(shared/src/general.ts)
export const extend = Object.assign

// dom 操作(runtime-core/src/nodeOps.ts   )
const doc = (typeof document !== 'undefined' ? document : null) as Document
export const nodeOps: Omit<RendererOptions<Node, Element>, 'patchProp'> = {
  // 插入节点
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },
  // 创建文本节点
  createText: text => doc.createTextNode(text),
    // 创建注释节点
  createComment: text => doc.createComment(text),
    //...
}
```

## createRenderer 实现

```
// 创建渲染器方法
function createRenderer(options) {
  return baseCreateRenderer(options)
}

// 真正创建渲染器函数
function baseCreateRenderer(options,createHydrationFns) {
  // ... 省略渲染方法

    // 渲染函数
  const render = (vnode, container, isSVG) => {
     //...
  }
  let hydrated;
  let hydrateNode;
  if (createHydrationFns) {
    ;[hydrate, hydrateNode] = createHydrationFns(internals)
  }

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

## createAppAPI 实现

```
let uid = 0

export function createAppAPI(render,hydrate){

  // 返回创建应用的createApp 方法(利用闭包缓存render, hydrate 参数)
  return function createApp(rootComponent, rootProps = null) {
    // rootComponent 就是传入的根组件
    // rootProps 为向根组件传入props 数据

    // 1. 如果根组件不是函数, 则进行一次浅拷贝
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent)
    }

    // 2.rootProps 为传入根组件的props , 参数必须是一个对象或null
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }

    // 3. 创建vue应用实例上下文对象, 就是一些默认配置
    const context = createAppContext()

    // 4. 初始化插件集合, 记录通过use 创建的插件
    const installedPlugins = new WeakSet()

    // 5. 始化应用挂载状态，默认为false
    let isMounted = false

    // 6. 创建 vue 应用实例对象
        // 同时将应用实例存储到context上下文的app属性
    const app: App = (context.app = {
      // 初始化应用属性
      _uid: uid++,  // 项目中可能存在多个vue实例，需使用id标识
      _component: rootComponent as ConcreteComponent,  // 根组件
      _props: rootProps,  // 传递给根组件的props
      _container: null,  // 挂载点: DOM容器
      _context: context,  // app上下文
      _instance: null,   // 应用实例

      version,   // 版本

      // 定义了一个访问器属性app.config，只能读取，不能直接替换
      get config() {return context.config},

      set config(v) {},

      // 挂载插件, 返回app对象
      use(plugin, ...options) {/*... 省略代码*/  return app },

      // 混入
      mixin(mixin) { /*... 省略代码*/ return app },

      // 注册全局组件
      component(name, component) { /*... 省略代码*/ return app },

      // 定义全局指令
      directive(name, directive) { /*... 省略代码*/ return app },

      // 应用挂载/卸载方法
      mount( rootContainer,isHydrate,isSVG ) {/*... 省略代码*/},
      unmount() { /*... 省略代码*/ },

      // 全局注入方法
      provide(key, value) {/*... 省略代码*/ return app },

      runWithContext(fn) {/*... 省略代码*/ }
    })

    // __COMPAT__ 判断是否兼容vue2
    // 若开启兼容，安装vue2相关的API
    if (__COMPAT__) {
      installAppCompatProperties(app, context, render)
    }

    // 返回 app 对象
    return app
  }
}
```

# 确定 mount 方法

```
export const createApp = ((...args) => {
  // 1. 首先创建应用
  const app = ensureRenderer().createApp(...args)

  // 2. 重写mount 方法
  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // ...后面分析
  }

  //3.返回应用
  return app
}) as CreateAppFunction<Element>
```

## createApp 函数中重写的 mount 方法

```
export const createApp = ((...args) => {
  // 创建应用实例对象
  const app = ensureRenderer().createApp(...args)

  // 重写mount 方法
  // 备份mount 方法
  const { mount } = app

  // 重写mount 方法
  app.mount = (containerOrSelector: Element | ShadowRoot | string) => {
    // 1. 获取挂载容器(dom元素)
    const container = normalizeContainer(containerOrSelector)
    // 没有容器直接return 无法挂载应用
    if (!container) return

    // 2. 处理根组件
    // 通过应用对象获取根组件, 即createApp() 方法第一个参数
    const component = app._component

    // 验证根组件是一个对象,且不具有render, template属性, 则使用挂载点内容作为模板
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.

      // 需要确保挂载点模板是可信的, 因为模板中可能存在JS表达式
      component.template = container.innerHTML

    }

    // 清空挂载点
    // clear content before mounting
    container.innerHTML = ''

    // 3. 调用 mount 真正的挂载
    // 调用从应用实例上备份的mount 进行挂载
    const proxy = mount(container, false, container instanceof SVGElement)

    // 挂载完成后, 清理v-clock指令, 为容器添加data-v-app 标识
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }

    // 返回根组件实例对象(注意不是app应用实例对象)
    return proxy
  }

  // 返回应用对象
  return app
}) as CreateAppFunction<Element>

// 获取挂载点dom 容器
function normalizeContainer(
  container: Element | ShadowRoot | string
): Element | null {

  // 1. 参数为字符串, 则通过querySelector 获取dom 元素
  if (isString(container)) {
    const res = document.querySelector(container)
    return res
  }

  // 2. 参数不是字符串, 则直接返回
  return container as any
}
```

## 应用对象本身的 mount 方法

- 通过调用 createVNode 创建虚拟节点, 参数为根组件对象和向根组件传入的 props 对象
- 通过调用 rendder 方法渲染虚拟节点

```
let isMounted = false

const app = {
  //...

  // app 挂载方法
  mount(rootContainer: HostElement,isHydrate?: boolean,isSVG?: boolean) {
    // 判断是否已经挂载
    if (!isMounted) {
      // #5571

      // 如果挂载容器具有__vue_app__, 表示当前容器已就作为其他应用挂载容器
      if (__DEV__ && (rootContainer as any).__vue_app__) {
        warn(
          `There is already an app instance mounted on the host container.\n` +
            ` If you want to mount another app on the same host container,` +
            ` you need to unmount the previous app by calling \`app.unmount()\` first.`
        )
      }

      // 1. 调用createVNode 创建根组件的VNode
      // rootComponent, rootProps 是createApp 调用时传入的参数, 根组件对象与props
      const vnode = createVNode(rootComponent, rootProps)

      // store app context on the root VNode.
      // this will be set on the root instance on initial mount.
      // 在根VNode上绑定应用上下文对象,在挂载完毕后绑定到根组件实例对象上
      vnode.appContext = context

      // HMR root reload
      // 热更新
      if (__DEV__) {
        context.reload = () => {
          render(cloneVNode(vnode), rootContainer, isSVG)
        }
      }

      // 2. 渲染 VNode
      // 其他渲染方式
      if (isHydrate && hydrate) {
        hydrate(vnode as VNode<Node, Element>, rootContainer as any)
      } else {
        // 浏览器调用render 渲染根VNode
        // render 函数在创建创建渲染函数中定义, 传递到createAppAPI, 通过闭包缓存
        render(vnode, rootContainer, isSVG)
      }

      // 挂载完毕后, isMounted 状态设置为true
      isMounted = true

      // 应用实例上绑定挂载容器
      app._container = rootContainer

      // for devtools and telemetry
      // 将app 应用实例对象绑定到容器上, 因此可以通过容器访问app 实例
      ;(rootContainer as any).__vue_app__ = app

      // 开发环境调试
      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        app._instance = vnode.component
        devtoolsInitApp(app, version)
      }


      return getExposeProxy(vnode.component!) || vnode.component!.proxy
    } else if (__DEV__) {
      warn(
        `App has already been mounted.\n` +
          `If you want to remount the same app, move your app creation logic ` +
          `into a factory function and create fresh app instances for each ` +
          `mount - e.g. \`const createMyApp = () => createApp(App)\``
      )
    }
  },
}
```

## createVNode 的具体实现

```
// _createVNode 第一个参数是必传的, 后面参数都具有默认值
function _createVNode(
  type,    // 创建VNode的类型
  props = null,
  children = null,
  patchFlag = 0,
  dynamicProps = null,
  isBlockNode = false
) {
  // type 不存在  或 type 值为 Symbol(v-ndc)
  // 则提示type 无效, 并将type 认定为 Comment 注释类型
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    if (__DEV__ && !type) {
      warn(`Invalid vnode type when creating vnode: ${type}.`)
    }
    type = Comment
  }

  // 判断type 是否已经是一个VNode
  if (isVNode(type)) {
   //...
  }

  // 调用isClassComponent 判断是否为有状态的组件
  // class component normalization.
  if (isClassComponent(type)) {
    type = type.__vccOpts
  }

  // 2.x async/functional component compat
  if (__COMPAT__) {
    type = convertLegacyComponent(type, currentRenderingInstance)
  }

  // props 参数存在, 则规范处理class, style
  // class & style normalization.
  if (props) {
   //...
  }

  // 判断VNode 标识, 采用二进制表示, 示例代码标识为 100 = 4
  // encode the vnode type information into a bitmap
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : __FEATURE_SUSPENSE__ && isSuspense(type)
      ? ShapeFlags.SUSPENSE
      : isTeleport(type)
        ? ShapeFlags.TELEPORT
        : isObject(type)
          ? ShapeFlags.STATEFUL_COMPONENT
          : isFunction(type)
            ? ShapeFlags.FUNCTIONAL_COMPONENT
            : 0

  // 判断节点状态
  if (__DEV__ && shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isProxy(type)) {
    //...
  }

  // 返回createBaseVNode 创建的VNode
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  )
}
```

## createBaseVNode 函数的实现如下:

- 创建 VNode, 并返回该虚拟节点, 即 JavaScript 对象

```
// 创建VNode
function createBaseVNode(
  type,
  props = null,
  children = null,
  patchFlag = 0,
  dynamicProps = null,
  shapeFlag = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false
) {
  // 虚拟节点对象 VNode
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  } as VNode

  // ...

  return vnode
}
```

## render 渲染 VNode

```
function baseCreateRenderer(options,createHydrationFns) {
    //...
  // render 渲染VNode 函数
  const render = (vnode, container, isSVG) => {
    // 如果VNode 不存在, 有可能之前已经挂载, 那么将会执行卸载操作
    if (vnode == null) {
      // container._vnode 表示上一次渲染的VNode, 存在则会执行卸载操作
      if (container._vnode) {
        unmount(container._vnode, null, null, true  // 卸载VNode
      }
    } else {
      // 如果VNode 存在, 则调用patch 方法, 判断处理除此渲染或更新渲染
      patch(container._vnode || null, vnode, container, null, null, null, isSVG)


    // 刷新任务队列, 暂不分析
    flushPreFlushCbs()
    flushPostFlushCbs()

    // 渲染完毕后, 容器记录渲染的VNode
    container._vnode = vnode
  }

  //...
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

# 初始化应用

1. 创建 Vue 应用实例对象。
2. 确定应用挂载容器节点。
3. 创建根组件 vnode 对象
4. 执行 render 渲染根组件 vnode。

# 渲染流程

1. 首先模版编译器将 html 转换为一个渲染函数
2. 然后初始化响应对象
3. 在渲染模块中，我们进入渲染阶段，这将调用 render 函数，它引用了响应对象，我们现在观察这个响应对象的变化，render 函数返回一个虚拟 dom 节点
4. 在挂载阶段，调用 mount 函数，使用虚拟 dom 节点创建 web 页面
5. 如果我们的响应对象发生任何改变，正在被监视，渲染器再次调用 render 函数，创建一个新的虚拟 dom 节点，新的和旧的虚拟 dom 节点，发送到补丁函数中，然后根据需要更新我们的网页
