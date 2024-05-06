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
    // 当同一个虚拟节点 (vnode) 需要在多个位置使用时。比如在 v-for 列表渲染中的复用情况。
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      // 如果不克隆 vnode 而直接使用，那么多个 DOM 元素将共享同一个 vnode 实例。这在更新过程中可能导致问题
      // 在使用 v-for 创建列表时，同一组件或元素可能被实例化多次。如果列表中的数据项目发生变化，Vue 需要能够独立地更新每一个实例。
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    // 这个节点是否是直接插入到目标容器中，而非作为某个已存在节点的子节点插入。
    // nested指示当前节点是否作为嵌套节点处理。如果nested是false，则表示该节点不是嵌套的，是一个根节点
    // Vue的过渡系统允许开发者在元素进入或离开DOM时添加动画效果。为了正确地触发这些过渡效果，Vue需要知道一个节点是否是作为一个独立的操作插入到DOM中的。
    // 在Vue的组件或元素树中，通常只有根节点需要触发进入的过渡效果。嵌套元素（例如在组件内部或由指令如v-for创建的元素）可能不应直接触发过渡，因为它们的过渡可能被父级或更高层次的逻辑管理。
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
        // 这段代码设计的目的是灵活处理虚拟节点（vnode）的插入时机和创建钩子的调用时机。
        // appendAsTree决定了 vnode 是否应该立即插入 DOM 树中。比如在特定的框架管理的过渡或动画过程中，或者某些需要延迟插入的情况。
        // in Weex, the default insertion order is parent-first.
        // List items can be optimized to use children-first insertion
        // with append="tree".
        const appendAsTree = isDef(data) && isTrue(data.appendAsTree);
        if (!appendAsTree) {
          // 这种情况适用于大多数标准的 vnode 创建过程，其中节点可以立即插入，并且在其子节点被处理前，适用于需要立即渲染单个元素的情况。
          if (isDef(data)) {
            // 触发所有相关的创建钩子。
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
        createChildren(vnode, children, insertedVnodeQueue); // 整构建整个子树，创建所有子节点。
        if (appendAsTree) {
          // 适用于需要先完整构建整个子树，然后再一次性插入到 DOM 中去的情况，在动态内容较多的大型应用中。
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm); // 一次性插入到 DOM 中
        }
      } else {
        // 当一个父 vnode 需要被实例化为一个真实的 DOM 元素时，它的子 vnode 们也需要被递归地转换成真实的 DOM 子元素
        // insertedVnodeQueue 收集在整个创建元素过程中已插入的所有 vnode。这个队列重要的用途是之后用于触发插入（insert）钩子。
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          // 在子组件完全创建（包括其所有子 DOM 元素）之后，再触发父组件的创建钩子。
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
      // 当组件已经被创建并初始化后，它的实例会被附加到它的虚拟节点的 componentInstance 属性上。
      // keep-alive 机制组件再次需要渲染时，它们的实例将会从 componentInstance 属性中恢复。
      if (isDef(vnode.componentInstance)) {
        // 组件实例正确初始化
        initComponent(vnode, insertedVnodeQueue);
        // 组件的根元素（vnode.elm）会被插入到父 DOM 元素（parentElm）中
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          // 处理重新激活的组件
          // 为什么需要先初始化再激活？确保了所有的基础设施（如钩子和依赖项）都被正确设置和更新。
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true; // 组件已经成功创建
      }
    }
  }

  // 将组件实例的 $el 与组件的虚拟节点关联起来，并执行相关的钩子函数。
  /*
  设置组件的占位符（placeholder）元素。
  初始化相关的钩子和状态。
  将组件加入到 insertedVnodeQueue 队列中，这个队列负责处理组件的插入相关生命周期钩子（如 mounted）。
  */
  function initComponent(vnode, insertedVnodeQueue) {
    // 有子组件需要被插入。
    // 在组件创建过程中，子组件可能先于父组件完成初始化，这时子组件的插入操作需要暂时挂起，待父组件准备就绪后再统一处理。
    // 子组件是异步加载,它的初始化和渲染可能会在父组件的初始化和渲染之后完成。
    // Vue 内部通过维护一个插入队列 (insertedVnodeQueue) 来确保所有的子组件在加载和初始化完成后，可以按正确的顺序插入到 DOM 中。
    if (isDef(vnode.data.pendingInsert)) {
      // 延迟执行插入钩子，直到所有相关的子组件也都准备好被插入到 DOM 中。
      /*
      异步组件加载完成时的批量插入：使用 pendingInsert 来收集所有这些组件的 VNodes。这样可以在一个批量操作中插入所有这些节点
      确保父子组件的钩子顺序：父组件的 mounted 钩子应该在其所有子组件的 mounted 钩子之后执行。延迟父组件的插入钩子的执行，直到所有子组件都插入到 DOM 并执行了它们的 mounted 钩子
      */
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
      // 不是一个标准的元素，而是一个需要特别处理的节点时（如文本或注释）
      registerRef(vnode); // 正确地注册或更新。
      // 它可能有关联的生命周期钩子需要被触发
      insertedVnodeQueue.push(vnode);
    }
  }

  /*
  reactivateComponent 作用主要是处理 <keep-alive> 包裹的组件的再激活过程。
  允许组件在被移除后仍然保存在内存中，并且可以在需要时重新激活而无需重新创建
  组件重新进入缓存状态：
  重新调用激活相关的钩子（如 activated）。
  重新绑定必要的资源或侦听器。
  更新组件状态以反映新的上下文。
  */
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
        // insertedVnodeQueue存放所有已插入但还未调用 insert 钩子的 vnode。
        // 在更新周期的最后，Vue 的渲染引擎会遍历这个队列，并为每一个 vnode 调用相应的 mounted 或 activated 钩子。这些钩子是组件生命周期的一部分，对于那些依赖于 DOM 的操作，如操作插件或第三方库初始化，非常关键。
        insertedVnodeQueue.push(innerNode);
        break;
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref) {
    // 确保只在有效的容器内插入新元素，避免在不存在的或未定义的节点上执行操作，这可能会导致运行时错误。
    if (isDef(parent)) {
      // 提供了ref节点
      if (isDef(ref)) {
        // 当有多个相似的父节点或可能的ref节点位于不同的父元素中时，这个检查防止了将元素插入到错误的位置。
        if (nodeOps.parentNode(ref) === parent) {
          // 在父节点parent中的ref节点之前插入新元素elm。
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        // 直接作为最后一个子节点插入
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

  //  检查 VNode 是否有一个有效的标签名或者一个组件实例。如果 VNode 代表一个普通的 HTML 元素或一个组件，那么它就可以通过 Vue 的渲染流程被创建、更新或修复。如果不是，那么这个节点可能只是一个简单的文本节点或其他非元素节点，这种情况下它不需要涉及常规的创建和更新钩子。
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
      // 说明old遍历完了，new没遍历的直接添加addVnodes
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
      // 说明new遍历完了，old没遍历完的直接删除removeVnodes
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

    // 在上一个渲染周期中，相关的异步组件尚未加载完成
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      // 在当前周期已经加载并解析完成
      if (isDef(vnode.asyncFactory.resolved)) {
        // 如果旧 VNode 是一个异步占位符，并且对应的异步组件已经解析完成，那么通过 hydrate 函数进行节点的更新。
        // 在使用动态导入（如 import()）加载 Vue 组件时，Vue 需要先渲染一个占位符，待组件加载完成后再替换为真实内容。
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        // 如果在下一个渲染周期该组件仍未加载完成，通过 vnode.isAsyncPlaceholder = true 继续维持其等待状态。
        vnode.isAsyncPlaceholder = true;
      }
      return;
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    // 静态树的重用
    /*
    isCloned
     使用 v-for 时克隆静态节点，优化渲染过程通过克隆已有的静态 VNode。
     当使用 v-if 和 v-else 时，为了优化渲染过程，Vue 可能会克隆现有的节点，特别是在这些节点是静态的情况下。
    */
    if (
      isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      // vnode.componentInstance 保存的是一个组件实例。包含了组件的所有属性、方法、数据、计算属性和观察者。
      // 何时会赋值给 vnode.componentInstance
      // 组件初始化：组件的 init 钩子被调用时
      // 组件更新：不需要在每次更新时重新实例化，同时保留已有的状态和生命周期。
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
    // 初次创建和插入流程的一部分，而非后续的更新或重渲染。
    if (isTrue(initial) && isDef(vnode.parent)) {
      // 暂时推迟子组件的 insert 钩子调用，直到父组件的挂载过程也完成。
      /*
      为什么不统一直接遍历 queue 调用 insert？
      1、如果立即执行所有 insert 钩子，可能会导致子组件的钩子在父组件的钩子之前执行。
      2、某些依赖于完整 DOM 树的操作（如尺寸计算、外部库集成等）需要在整个组件树稳定后执行
      具体应用场景
      1、组件A包含子组件B和C：A可能需要读取B和C渲染后的尺寸或状态来进行某些计算。
      2、使用<keep-alive>：如果B或C从缓存中恢复时需要重新计算或重渲染，确保它们的 insert 钩子在A的对应逻辑之后运行是很重要的。
      3、服务器端渲染（SSR）：在SSR期间，如 mounted 不会被调用，因为没有真实的DOM环境。但在客户端激活（hydration）过程中，这些钩子的正确调用顺序对于应用能否正确无缝接管服务器渲染的内容至关重要。
      */
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
  // 主要职责是将服务器渲染的 HTML 与客户端生成的虚拟 DOM (VNode) 进行“激活”或同步，确保它们能够无缝对接并交由 Vue 管理
  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
    let i;
    const { tag, data, children } = vnode;
    inVPre = inVPre || (data && data.pre); // 确定是否需要跳过标准化过程，通常用于预处理指令。
    vnode.elm = elm; // 设置为对应的真实 DOM 元素 elm。

    // 是一个注释节点并且关联了异步工厂（异步组件），则将其标记为异步占位符。
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true;
    }
    // assert node match
    if (process.env.NODE_ENV !== "production") {
      // 确保服务器渲染的 HTML 节点与客户端的 VNode 匹配
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false;
      }
    }
    if (isDef(data)) {
      // 处理组件初始化：
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
        // 虚拟节点（VNode）的子节点
        // empty element, allow client to pick up and populate children
        /*
        初始时，<div> DOM 元素（elm）没有子节点，elm.hasChildNodes() 返回 false。
        当 show 变为 true 后，vnode.children 将包含一个新的 <p> 虚拟节点。
        Vue 检测到 elm.hasChildNodes() 为 false 而 vnode.children 非空，会创建新的 <p> DOM 元素并将其插入到 <div> 中。
        确保虚拟 DOM 和实际 DOM 之间保持同步，从而准确反映应用的状态和结构。
        */
        if (!elm.hasChildNodes()) {
          // 对应真实 DOM 元素是否有子节点
          // 表示当前的 DOM 元素没有子节点。
          /*
          如果服务器渲染的 HTML 结构中某个元素应该包含子元素但实际上并没有渲染出子元素
          对于静态内容或使用条件渲染的组件（如 v-if，v-for 可能未渲染任何内容），在特定条件下可能没有生成任何子节点。
          初次渲染的元素在初始状态可能没有子节点，尤其是在数据依赖异步获取的情况下。
          */
          // 如果存在子节点（children），函数将检查 DOM 中是否有现有的子节点。如果没有，将创建新的子节点。
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (
            isDef((i = data)) &&
            isDef((i = i.domProps)) &&
            isDef((i = i.innerHTML))
          ) {
            if (i !== elm.innerHTML) {
              // 表示服务器渲染的 HTML 与客户端应该渲染的 HTML 存在差异
              //  SSR 场景 | 富文本内容的组件。
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
            // 已有子节点，函数会递归地对每个子节点调用 hydrate，确保每个子节点都被正确激活。
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
            // 对比和验证 DOM 与 VNode 的一致性：
            /*
            childrenMatch 可能被设置为 false 的情况：
            DOM 节点与 VNode 不匹配：意味着当前的子节点与预期的虚拟节点不一致。
            子节点数量不足：实际的 DOM 子节点数量少于 VNode 列表中的节点数量

            childNode 仍然存在的情况：意味着 DOM 中还有未被处理的额外节点。由于服务器渲染的内容包含了不应该出现的额外元素，或者客户端的虚拟 DOM 结构在创建时遗漏了一些节点。

            */
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
            // 对于元素节点，遍历 data 并根据需要触发相应的 create 钩子。
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
      // 如果当前处理的是文本节点，更新其文本内容。
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
