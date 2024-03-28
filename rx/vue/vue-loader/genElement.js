// 生成元素节点的函数
// el 是当前正在处理的元素节点，
//     tag: 'div'（表示标签名）
//     attrsList: [{ name: 'id', value: 'app' }]（表示标签上的所有属性）
//     attrsMap: { id: 'app' }（属性的映射形式）
//     children: 一个数组，包含 <div> 的子元素
//     parent: null（因为这是根元素）
//     其他与此元素相关的数据，例如 plain, staticClass, staticStyle 等。
// state 是编译过程中的状态对象，包含了一些辅助函数和必要的状态信息。
//     options: 包含编译选项的对象，如用于处理指令、混入、过滤器等的方法。
//     warn: 用于记录编译时警告的函数。
//     transforms: 一个数组，包含应用于元素的所有模块转换函数。
//     dataGenFns: 用于生成数据属性的函数数组。
//     directives: 包含可用指令的对象。
//     maybeComponent: 一个函数，用来判断一个元素是否是一个动态组件。
//     pre: 一个布尔值，表示是否处在 v-pre 指令的作用域内。
//     其他与编译状态相关的数据。

function genElement(el, state) {
  // 检查当前元素节点是否有父节点。
  if (el.parent) {
    // 这里的 pre 通常用于表示是否需要跳过编译，
    el.pre = el.pre || el.parent.pre // 继承父节点的 pre 属性
  }
  // 当前节点是静态根节点（即不会改变的内容）并且尚未处理
  // 不需要在每次渲染时重新生成。
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    // 节点及其子节点只会被渲染一次，随后的渲染将直接使用缓存，提高性能。
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    // 没有定义插槽目标，也不是预编译情况
    // 只生成其子节点的代码。
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    // 生成插槽的代码
    return genSlot(el, state)
  } else {
    // component or element
    var code
    if (el.component) {
      // 生成这个组件的渲染代码
      code = genComponent(el.component, el, state)
    } else {
      var data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        // 如果元素不是普通元素（即含有指令、绑定等）
        // 或者元素含有 `v-pre` 指令且可能是一个组件
        data = genData$2(el, state) // 生成数据部分的代码。
      }
      // 如果元素不是内联模板，则会通过 `genChildren` 函数生成其子元素的代码。
      var children = el.inlineTemplate ? null : genChildren(el, state, true)
      // 使用 `_c` 方法来创建一个虚拟节点（VNode）
      code = "_c('" + el.tag + "'" + (data ? ',' + data : '') + (children ? ',' + children : '') + ')'
    }
    // module transforms 存在任何模块转换
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}

// ;<template>
//   <div id="app">
//     <p v-if="visible">看到我了!</p>
//     <ul v-for="item in items">
//       <li>{{ item }}</li>
//     </ul>
//   </div>
// </template>

function render() {
  return _c('div', { attrs: { id: 'app' } }, [
    visible ? _c('p', ['看到我了!']) : _e(), // _e 代表创建一个空的虚拟节点。
    _l(items, function (item) {
      // _l 代表列表渲染,_s 是将数据转换为字符串的函数。
      return _c('li', [_v(_s(item))]) // _s 用于字符串化，_v 用于创建文本节点
    })
  ])
}

// genIf 函数
function genIf() {
  // ;<p v-if="visible">看到我了!</p>
  // 第一步：标记元素,为了避免在后续的编译过程中重复处理：
  el.ifProcessed = true // 标记元素，避免重复处理
  // 第二步：解析 v-if 条件
  const condition = el.if // "visible"，这是 v-if 指令的条件表达式
  // 第三步：生成条件表达式代码,用于在运行时根据条件决定是否渲染对应的节点：
  return `(${condition}) ? ${genElement(el, state)} : _e()`
  // 递归调用 genElement 以生成当前元素（即 <p> 元素）的渲染函数代码。
  // _c('p', [_v('看到我了!')])
  // (visible) ? _c('p', [_v("看到我了!")]) : _e()
}

//  Vue 编译器是如何从 AST 生成渲染函数代码
// 伪代码，简化版的编译器核心
function generateCode(ast) {
  if (ast.type === 1) {
    // 元素节点
    // 生成元素节点代码
    const childrenCode = ast.children.map(child => generateCode(child)).join(',')
    return `_c('${ast.tag}', [${childrenCode}])`
  } else if (ast.type === 3) {
    // 文本节点
    // 生成文本节点代码
    return `_v(${JSON.stringify(ast.text)})`
  }
}

// 示例AST，对应于<div><p>Hello World</p></div>
// const ast = {
//     type: 1,
//     tag: 'div',
//     children: [
//         {
//             type: 1,
//             tag: 'p',
//             children: [
//                 {
//                     type: 3,
//                     text: 'Hello World'
//                 }
//             ]
//         }
//     ]
// };

// 生成渲染函数代码
function generateRenderFn(ast) {
  const renderFnBody = `with(this) { return createElement('${ast.tag}', [${generateChildren(ast.children)}]) }`
  return new Function('createElement', renderFnBody)
}
// 在Vue中，createElement 函数是用于创建虚拟DOM节点的关键函数。
// 这个VNode是一个JavaScript对象，它描述了应该在页面上渲染的DOM元素的结构和属性。
// 当组件的状态改变，需要更新DOM时，Vue不会立即操作DOM。相反，它将重新运行渲染函数来获得新的虚拟DOM树，然后将新旧虚拟DOM树进行比较（这个过程称为“diff”），并计算出需要进行的最小更新。最后，Vue将这些更新应用到实际的DOM上，从而改变用户看到的页面内容。

// createElement函数的基本结构
function createElement(tag, data, children) {
  // 1. 简单示例，不处理组件逻辑
  if (typeof tag === 'string') {
    // 创建虚拟节点
    return createVNode(tag, data, children)
  } else {
    // 处理组件逻辑（略）
  }
}
// createVNode函数是createElement的辅助函数，用于实际创建虚拟节点对象。
function createVNode(tag, data, children) {
  // 创建VNode对象
  const vnode = {
    tag, // 标签名
    data, // 数据对象
    children // 子节点
    // 更多属性...
  }
  return vnode
}
// 子节点处理
if (typeof children === 'string') {
  vnode.children = [createTextNode(children)]
} else if (Array.isArray(children)) {
  vnode.children = children.map(child => {
    // 递归处理子节点
    return typeof child === 'object' ? child : createTextNode(child)
  })
}
// 文本节点的创建
function createTextNode(text) {
  return {
    tag: undefined, // 文本节点没有标签名
    data: {}, // 文本节点通常不携带额外数据
    text // 文本内容
  }
}
