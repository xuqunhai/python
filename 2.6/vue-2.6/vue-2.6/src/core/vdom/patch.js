/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

import VNode, { cloneVNode } from "./vnode";
import config from "../config";
import { SSR_ATTR } from "shared/constants";
import { registerRef } from "./modules/ref";
import { traverse } from "../observer/traverse";
import { activeInstance } from "../instance/lifecycle";
import { isTextInputType } from "web/util/element";

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  makeMap,
  isRegExp,
  isPrimitive,
} from "../util/index";

export const emptyNode = new VNode("", {}, []);

const hooks = ["create", "activate", "update", "remove", "destroy"];

function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error)))
  );
}

function sameInputType(a, b) {
  if (a.tag !== "input") return true;
  let i;
  const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
  const typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
  return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

export function createPatchFunction(backend) {
  let i, j;
  const cbs = {};

  const { modules, nodeOps } = backend;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(
      nodeOps.tagName(elm).toLowerCase(),
      {},
      [],
      undefined,
      elm
    );
  }

  function createRmCb(childElm, listeners) {
    function remove() {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove;
  }

  function removeNode(el) {
    const parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement(vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some((ignore) => {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag;
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    );
  }

  let creatingElmInVPre = 0;

  // 根据虚拟节点（VNode）创建真实 DOM 元素，并插入到页面中。
  // 处理了多种类型的 VNode（包括组件、普通元素、注释节点和文本节点），并将它们插入到父 DOM 元素中。
  function createElm(
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    // 如果这个 VNode 在之前的渲染中已经被使用（即 vnode.elm 已经定义）并且它是从 ownerArray 中来的
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      // 克隆这个 VNode 来避免潜在的 patch 错误。
      // 这通常发生在被 v-for 渲染的元素被再次使用时。
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    // 处理组件 VNode 组件渲染。
    // 如果这个 VNode 是一个组件，尝试创建组件实例并插入到父元素中。如果创建成功，不再继续后续的 DOM 创建流程。
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    const data = vnode.data;
    const children = vnode.children;
    const tag = vnode.tag;
    // 创建普通元素
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== "production") {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          warn(
            "Unknown custom element: <" +
              tag +
              "> - did you " +
              "register the component correctly? For recursive components, " +
              'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      // 根据是否有命名空间（ns）来创建普通的 DOM 元素或带命名空间的元素，比如 SVG。
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      // 为 VNode 设置作用域 CSS。这与 Vue.js 的 Scoped CSS 功能有关。
      // <style scoped>
      setScope(vnode);

      /* istanbul ignore if */
      if (__WEEX__) {
        // in Weex, the default insertion order is parent-first.
        // List items can be optimized to use children-first insertion
        // with append="tree".
        const appendAsTree = isDef(data) && isTrue(data.appendAsTree);
        if (!appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
        createChildren(vnode, children, insertedVnodeQueue);
        if (appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
      } else {
        // 创建子元素-递归地为所有子 VNode 创建 DOM 元素并插入到当前节点中。-嵌套元素渲染。
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        // 将创建的 DOM 元素插入到父元素中，如果 refElm 定义了，则插入到 refElm 之前。 - 动态元素插入。
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== "production" && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      // 创建注释节点
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      // 创建文本节点
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  // 负责初始化组件 VNode，插入组件的 DOM 元素，并处理组件的激活状态。
  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data;
    // 检查组件定义
    if (isDef(i)) {
      // 处理 KeepAlive 组件
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef((i = i.hook)) && isDef((i = i.init))) {
        // 调用这个 init 钩子函数以初始化组件
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        // 初始化这个组件 VNode，并将组件的根 DOM 元素插入到父元素中。
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          // 处理重新激活的组件
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true; // 组件已经成功创建
      }
    }
  }

  // 将组件实例的 $el 与组件的虚拟节点关联起来，并执行相关的钩子函数。
  function initComponent(vnode, insertedVnodeQueue) {
    // 有子组件需要被插入。
    // 在组件创建过程中，子组件可能先于父组件完成初始化，这时子组件的插入操作需要暂时挂起，待父组件准备就绪后再统一处理。
    // 子组件是异步加载,它的初始化和渲染可能会在父组件的初始化和渲染之后完成。
    // Vue 内部通过维护一个插入队列 (insertedVnodeQueue) 来确保所有的子组件在加载和初始化完成后，可以按正确的顺序插入到 DOM 中。
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(
        insertedVnodeQueue,
        vnode.data.pendingInsert
      );
      vnode.data.pendingInsert = null;
    }
    // 将组件实例的根 DOM 元素（$el）与组件的虚拟节点（VNode）关联起来。
    // 便于虚拟 DOM 算法正确地更新和渲染组件。
    vnode.elm = vnode.componentInstance.$el;

    // 调用创建钩子并设置作用域
    // 例如，一个组件渲染了一个 <div> 作为根元素，这时需要为这个 <div> 调用相关的创建钩子，并应用 Scoped CSS。
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // 对于没有可挂载的根 DOM 元素的组件（例如渲染函数返回空或仅返回注释节点的组件）.例如，一个条件渲染组件，它可能在某些条件下不渲染任何东西：
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    let i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    let innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break;
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== "production") {
        checkDuplicateKeys(children);
      }
      for (let i = 0; i < children.length; ++i) {
        createElm(
          children[i],
          insertedVnodeQueue,
          vnode.elm,
          null,
          true,
          children,
          i
        );
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(
        vnode.elm,
        nodeOps.createTextNode(String(vnode.text))
      );
    }
  }

  // 确保无论组件嵌套了多少层，都能找到与之对应的实际 DOM 元素的 VNode。
  // 准确地更新 DOM,正确地更新每个组件。
  function isPatchable(vnode) {
    // 每个组件实例的 componentInstance 属性指向其子组件的实例。
    // 每个组件实例的 _vnode 属性代表了该组件的根虚拟节点（VNode）。
    while (vnode.componentInstance) {
      // 使用 while 循环来处理组件的嵌套情况,一直到我们找到一个不是组件（即没有 componentInstance 属性）的 VNode
      // 找到实际对应于 DOM 元素的 VNode。
      vnode = vnode.componentInstance._vnode;
    }
    // 如果这个 tag 属性存在，那么这个 VNode 就可以被“修补”，因为它对应于一个具体的 DOM 元素。
    return isDef(vnode.tag);
    // 对于那些如文本节点或注释节点这样没有 tag 的 VNode，它们虽然也对应于真实的 DOM，但由于它们不包含子节点或特定的 DOM 元素属性，所以处理方式略有不同。
    // 组件 VNode 和其他没有 tag 的特殊 VNode（例如由 v-if 创建的空 VNode）不直接参与 DOM 的“修补”。
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
      cbs.create[i](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode);
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope(vnode) {
    let i;
    if (isDef((i = vnode.fnScopeId))) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      let ancestor = vnode;
      while (ancestor) {
        if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (
      isDef((i = activeInstance)) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef((i = i.$options._scopeId))
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes(
    parentElm,
    refElm,
    vnodes,
    startIdx,
    endIdx,
    insertedVnodeQueue
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(
        vnodes[startIdx],
        insertedVnodeQueue,
        parentElm,
        refElm,
        false,
        vnodes,
        startIdx
      );
    }
  }

  function invokeDestroyHook(vnode) {
    let i, j;
    const data = vnode.data;
    if (isDef(data)) {
      if (isDef((i = data.hook)) && isDef((i = i.destroy))) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
    }
    if (isDef((i = vnode.children))) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      let i;
      const listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (
        isDef((i = vnode.componentInstance)) &&
        isDef((i = i._vnode)) &&
        isDef(i.data)
      ) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(
    parentElm,
    oldCh,
    newCh,
    insertedVnodeQueue,
    removeOnly
  ) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly;

    if (process.env.NODE_ENV !== "production") {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(
          oldStartVnode,
          newStartVnode,
          insertedVnodeQueue,
          newCh,
          newStartIdx
        );
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(
          oldEndVnode,
          newEndVnode,
          insertedVnodeQueue,
          newCh,
          newEndIdx
        );
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(
          oldStartVnode,
          newEndVnode,
          insertedVnodeQueue,
          newCh,
          newEndIdx
        );
        canMove &&
          nodeOps.insertBefore(
            parentElm,
            oldStartVnode.elm,
            nodeOps.nextSibling(oldEndVnode.elm)
          );
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(
          oldEndVnode,
          newStartVnode,
          insertedVnodeQueue,
          newCh,
          newStartIdx
        );
        canMove &&
          nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx))
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) {
          // New element
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx
          );
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(
              vnodeToMove,
              newStartVnode,
              insertedVnodeQueue,
              newCh,
              newStartIdx
            );
            oldCh[idxInOld] = undefined;
            canMove &&
              nodeOps.insertBefore(
                parentElm,
                vnodeToMove.elm,
                oldStartVnode.elm
              );
          } else {
            // same key but different element. treat as new element
            createElm(
              newStartVnode,
              insertedVnodeQueue,
              parentElm,
              oldStartVnode.elm,
              false,
              newCh,
              newStartIdx
            );
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        refElm,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      );
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys(children) {
    const seenKeys = {};
    for (let i = 0; i < children.length; i++) {
      const vnode = children[i];
      const key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            `Duplicate keys detected: '${key}'. This may cause an update error.`,
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld(node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) return i;
    }
  }

  // 这个函数处理了多种情况，包括异步占位符、静态树重用、子节点更新、文本内容更新以及钩子函数调用
  function patchVnode(
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    // 如果新旧 VNode 完全相同，没有必要更新，直接返回。
    // 通常发生在静态内容或未发生变化的内容上
    if (oldVnode === vnode) {
      return;
    }

    // VNode 已经被渲染过（即 vnode.elm 已定义）
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      // 为了避免直接修改正在使用的 VNode
      // 在列表渲染时，某些 VNode 可能因为数据的变化被多次引用和渲染。
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    const elm = (vnode.elm = oldVnode.elm);

    // 处理异步占位符
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        // 如果旧 VNode 是一个异步占位符，并且对应的异步组件已经解析完成，那么通过 hydrate 函数进行节点的更新。
        // 在使用动态导入（如 import()）加载 Vue 组件时，Vue 需要先渲染一个占位符，待组件加载完成后再替换为真实内容。
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return;
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    // 静态树的重用
    if (
      isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      //  都是静态的（不会改变的），且具有相同的 key
      // 重用旧节点的组件实例。
      // 适用于不依赖父组件数据，且不会改变的子组件或 DOM 结构，如静态的页脚、侧边栏导航等。
      vnode.componentInstance = oldVnode.componentInstance;
      return;
    }

    let i;
    const data = vnode.data;
    // 预处理钩子,调用prepatch 钩子
    if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
      i(oldVnode, vnode);
    }

    const oldCh = oldVnode.children;
    const ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
    }

    // 更新子节点
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        // 新旧 VNode 的子节点不同，调用 updateChildren 函数进行深度比较和更新。
        // ，如列表渲染的数据源发生变化。
        if (oldCh !== ch)
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
      } else if (isDef(ch)) {
        // 如从展示列表项的状态切换到显示一个提示信息，或者反之。
        if (process.env.NODE_ENV !== "production") {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, "");
      }
    } else if (oldVnode.text !== vnode.text) {
      // 文本内容的更新
      // 一个显示用户消息数量的标签，当消息数量更新时需要更改显示的数字。
      nodeOps.setTextContent(elm, vnode.text);
    }
    // 定义了 postpatch 钩子，则在 DOM 更新完成后调用它。
    if (isDef(data)) {
      if (isDef((i = data.hook)) && isDef((i = i.postpatch)))
        i(oldVnode, vnode);
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (let i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  let hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  const isRenderedModule = makeMap("attrs,class,staticClass,staticStyle,key");

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
    let i;
    const { tag, data, children } = vnode;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true;
    }
    // assert node match
    if (process.env.NODE_ENV !== "production") {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false;
      }
    }
    if (isDef(data)) {
      if (isDef((i = data.hook)) && isDef((i = i.init)))
        i(vnode, true /* hydrating */);
      if (isDef((i = vnode.componentInstance))) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (
            isDef((i = data)) &&
            isDef((i = i.domProps)) &&
            isDef((i = i.innerHTML))
          ) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (
                process.env.NODE_ENV !== "production" &&
                typeof console !== "undefined" &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn("Parent: ", elm);
                console.warn("server innerHTML: ", i);
                console.warn("client innerHTML: ", elm.innerHTML);
              }
              return false;
            }
          } else {
            // iterate and compare children lists
            let childrenMatch = true;
            let childNode = elm.firstChild;
            for (let i = 0; i < children.length; i++) {
              if (
                !childNode ||
                !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)
              ) {
                childrenMatch = false;
                break;
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (
                process.env.NODE_ENV !== "production" &&
                typeof console !== "undefined" &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn("Parent: ", elm);
                console.warn(
                  "Mismatching childNodes vs. VNodes: ",
                  elm.childNodes,
                  children
                );
              }
              return false;
            }
          }
        }
      }
      if (isDef(data)) {
        let fullInvoke = false;
        for (const key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }
        if (!fullInvoke && data["class"]) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data["class"]);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true;
  }

  function assertNodeMatch(node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf("vue-component") === 0 ||
        (!isUnknownElement(vnode, inVPre) &&
          vnode.tag.toLowerCase() ===
            (node.tagName && node.tagName.toLowerCase()))
      );
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
      return;
    }

    let isInitialPatch = false;
    const insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      // 所有的真实 DOM 节点都会有一个 nodeType 属性，而虚拟节点（VNode）则没有。
      /*
      isRealElement 会为 false 应用场景：组件更新/虚拟节点的渲染
      */
      const isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          /*      
          isRealElement 为 true 表示 oldVnode 是一个真实的 DOM 元素。这种情况主要发生在 Vue 实例挂载到一个真实的 DOM 元素上，或者 Vue 正在接管服务端渲染的静态内容时。
          */
          // 当页面是由服务器渲染的，并且 Vue 在客户端接管时，尝试进行 hydration 操作。
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if (process.env.NODE_ENV !== "production") {
              warn(
                "The client-side rendered virtual DOM tree is not matching " +
                  "server-rendered content. This is likely caused by incorrect " +
                  "HTML markup, for example nesting block-level elements inside " +
                  "<p>, or missing <tbody>. Bailing hydration and performing " +
                  "full client-side render."
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        const oldElm = oldVnode.elm;
        const parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        // 更新父节点占位符元素，确保组件树中的所有父级引用都正确更新。
        if (isDef(vnode.parent)) {
          // vnode.parent 指的是 ChildComponent 在父组件 ParentComponent 中的占位符 VNode。
          let ancestor = vnode.parent;
          // 是否有对应的 DOM 元素标签
          const patchable = isPatchable(vnode);
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              // 负责在组件树更新时执行一些清理操作
              cbs.destroy[i](ancestor);
            }
            // 将当前 vnode 的 DOM 元素引用更新到所有祖先节点。
            // 这确保了祖先节点的 DOM 引用与实际渲染的内容保持一致。
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                // 处理属性、事件监听器等。
                cbs.create[i](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  // 处理节点插入到 DOM 之后的逻辑，例如动画或焦点管理。
                  insert.fns[i]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        // 当新的 VNode 替换了旧的 VNode 后，移除旧的 DOM 元素或调用旧 VNode 的销毁钩子。如使用 v-if 切换不同的组件时。
        /*
        parentElm 没有定义，这通常发生在以下几种情况：
        独立的 Vue 组件（例如，通过 new Vue({...}) 创建并挂载的组件）被销毁时，因为销毁动作是从组件自身开始的，而不是通过从父 DOM 元素中移除来实现的。
        虚拟 DOM 节点的程序化处理：直接操作虚拟 DOM，创建和销毁虚拟节点
        SSR（服务端渲染）场景组件会生成虚拟 DOM，但是由于在服务器端，并没有真实的 DOM 环境
        */
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    // 调用插入钩子
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}
