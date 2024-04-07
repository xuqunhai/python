/* @flow */

import VNode from "./vnode";
import { resolveConstructorOptions } from "core/instance/init";
import { queueActivatedComponent } from "core/observer/scheduler";
import { createFunctionalComponent } from "./create-functional-component";

import { warn, isDef, isUndef, isTrue, isObject } from "../util/index";

import {
  resolveAsyncComponent,
  createAsyncPlaceholder,
  extractPropsFromVNodeData,
} from "./helpers/index";

import {
  callHook,
  activeInstance,
  updateChildComponent,
  activateChildComponent,
  deactivateChildComponent,
} from "../instance/lifecycle";

import {
  isRecyclableComponent,
  renderRecyclableComponentTemplate,
} from "weex/runtime/recycle-list/render-component-template";

// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  // 在组件 VNode 初始化时调用。用于组件实例的创建和初始化。
  init(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ));
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
  // 在组件开始更新之前调用。用于在旧节点和新节点被比较前处理一些逻辑。
  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions;
    const child = (vnode.componentInstance = oldVnode.componentInstance);
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },
  // 在组件被插入到 DOM 中后调用。常用于执行需要访问 DOM 元素时的操作，如操作 DOM 或初始化第三方库。
  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, "mounted");
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },
  // 在组件开始销毁过程时调用。用于执行清理工作，如移除事件监听器、取消定时器等。
  destroy(vnode: MountedComponentVNode) {
    const { componentInstance } = vnode;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  },
};

const hooksToMerge = Object.keys(componentVNodeHooks);

// 创建组件 VNode
// 包括异步组件、函数式组件、抽象组件
// 确保了组件的 props、事件监听器和子节点被正确处理。
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // 如果组件构造函数未定义，直接返回。这防止了创建无效的组件实例。
  if (isUndef(Ctor)) {
    return;
  }

  // 获取基础构造函数-所有的组件实例共享同一个基础构造函数 Vue。
  const baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  // 转换对象为构造函数。这允许我们使用一个普通对象来定义一个组件。
  // Vue.component('my-component', {...})
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  // 验证构造函数
  if (typeof Ctor !== "function") {
    if (process.env.NODE_ENV !== "production") {
      warn(`Invalid Component definition: ${String(Ctor)}`, context);
    }
    return;
  }

  // async component
  // 异步组件处理
  let asyncFactory;
  // 如果 Ctor.cid 未定义，认为 Ctor 是一个异步组件的定义。
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    // 解析异步组件
    // Vue.component('async-example', () => ({component: import('./MyAsyncComponent.vue'),error: ErrorComponent,...}))
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    // 如果解析未完成，则创建一个异步占位符 vnode。
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    // 将组件的 v-model 数据转换成适当的 props 和 events。
    transformModel(Ctor.options, data);
  }

  // extract props
  // 将父组件中定义的 props 传递给子组件的过程。
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    // 创建函数式组件的 vnode。
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  // 为组件提取出原生事件监听器，这些监听器需要被当作子组件监听器而不是 DOM 监听器来处理。
  const listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  // 抽象组件处理-例如 <transition> 或 <keep-alive>
  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    // 只保留 slot 数据。抽象组件不渲染真实 DOM，它们通常用于包裹其他组件并管理它们的行为
    const slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  // 安装组件钩子
  installComponentHooks(data);

  // return a placeholder vnode
  const name = Ctor.options.name || tag;
  // 创建组件的虚拟节点
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ""}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  // 在 Weex 环境下，如果组件是可回收的
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode);
  }

  // 返回创建的组件虚拟节点（VNode）。
  return vnode;
}

export function createComponentInstanceForVnode(
  // we know it's MountedComponentVNode but flow doesn't
  vnode: any,
  // activeInstance in lifecycle state
  parent: any
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  };
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const existing = hooks[key];
    const toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook(f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged;
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
// 将 v-model 指令转换为具体的 prop 和 event 监听，以实现双向绑定。
function transformModel(options, data: any) {
  // 如果组件的选项中定义了 model 对象，并且指定了 prop 和 event，则使用指定的值
  const prop = (options.model && options.model.prop) || "value";
  const event = (options.model && options.model.event) || "input";
  // 设置 prop
  (data.attrs || (data.attrs = {}))[prop] = data.model.value;
  // 初始化事件监听对象
  const on = data.on || (data.on = {});
  // 获取现有的事件监听器（如果有的话），并获取 v-model 绑定的回调函数。
  const existing = on[event];
  const callback = data.model.callback;
  // 检查并合并回调
  // 检查新的回调函数是否已经在监听器列表中。如果不在，则将其添加到监听器列表的最前面。这确保了 v-model 的回调函数被正确执行。
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
  /*
  // 自定义 v-model 绑定使用的 prop 和 event。
<template>
  <input :value="value" @input="onInput">
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value'],
  methods: {
    onInput(event) {
      this.$emit('change', event.target.value);
    }
  }
}
</script>
*/
}
