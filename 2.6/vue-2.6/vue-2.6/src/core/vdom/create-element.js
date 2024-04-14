/* @flow */

import config from "../config";
import VNode, { createEmptyVNode } from "./vnode";
import { createComponent } from "./create-component";
import { traverse } from "../observer/traverse";

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isObject,
  isPrimitive,
  resolveAsset,
} from "../util/index";

import { normalizeChildren, simpleNormalizeChildren } from "./helpers/index";

const SIMPLE_NORMALIZE = 1;
const ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType);
}

// 用于在渲染函数中创建虚拟节点
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // 如果 data 对象被观察（即它是响应式的），则发出警告。因为这可能导致性能问题。
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(
          data
        )}\n` + "Always create fresh vnode data objects in each render!",
        context
      );
    return createEmptyVNode();
  }
  // object syntax in v-bind
  // is 特殊属性的处理。这用于动态组件。
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    // 例如，:is 绑定了一个假值），则返回一个空的虚拟节点。
    return createEmptyVNode();
  }
  // warn against non-primitive key
  // 非原始 key 的警告。因为非原始的 key 值可能导致渲染问题。
  // <div v-for="item in items" :key="{id: item.id}"> <!-- 错误示范：key 应该是一个原始值 -->
  if (
    process.env.NODE_ENV !== "production" &&
    isDef(data) &&
    isDef(data.key) &&
    !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !("@binding" in data.key)) {
      warn(
        "Avoid using non-primitive value as key, " +
          "use string/number value instead.",
        context
      );
    }
  }
  // support single function children as default scoped slot
  // 被认为是默认的作用域插槽。
  // return h('div', [this.$scopedSlots.default({})]);
  if (Array.isArray(children) && typeof children[0] === "function") {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  // 子节点标准化。这是为了处理子节点数组的不同可能形式，如嵌套数组。
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  let vnode, ns;
  // 创建 VNode
  if (typeof tag === "string") {
    let Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    // 保留的 HTML 或 SVG 标签
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (
        process.env.NODE_ENV !== "production" &&
        isDef(data) &&
        isDef(data.nativeOn) &&
        data.tag !== "component"
      ) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      );
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, "components", tag)))
    ) {
      // component
      // 组件选项对象或构造函数,创建组件 VNode。
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }

  // 处理命名空间和深度绑定
  if (Array.isArray(vnode)) {
    // 这种情况可能发生在函数式组件返回多个根节点时
    return vnode;
  } else if (isDef(vnode)) {
    // 检查并应用命名空间（主要用于 SVG 和 MathML 元素），
    // 并注册深度绑定数据（如果 `data` 对象定义了且包含绑定的数据）。
    // 然后返回 `vnode`。
    if (isDef(ns)) applyNS(vnode, ns);
    if (isDef(data)) registerDeepBindings(data);
    return vnode;
  } else {
    // 在 `tag` 不是有效的字符串，也不是组件定义时。
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === "foreignObject") {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (let i = 0, l = vnode.children.length; i < l; i++) {
      const child = vnode.children[i];
      if (
        isDef(child.tag) &&
        (isUndef(child.ns) || (isTrue(force) && child.tag !== "svg"))
      ) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}
