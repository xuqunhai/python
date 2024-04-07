// 伪代码，简化版的编译器核心
function generateCode(ast) {
  if (ast.type === 1) {
    // 元素节点
    // 生成元素节点代码
    const childrenCode = ast.children
      .map((child) => generateCode(child))
      .join(",");
    return `_c('${ast.tag}', [${childrenCode}])`;
  } else if (ast.type === 3) {
    // 文本节点
    // 生成文本节点代码
    return `_v(${JSON.stringify(ast.text)})`;
  }
}

// 示例AST，对应于<div><p>Hello World</p></div>
const ast = {
  type: 1,
  tag: "div",
  children: [
    {
      type: 1,
      tag: "p",
      children: [
        {
          type: 3,
          text: "Hello World",
        },
      ],
    },
  ],
};

// 生成渲染函数代码
const renderFunctionCode = `with(this){return ${generateCode(ast)}}`;
console.log(renderFunctionCode);

// 示例二
// 更具体的示例来说明 Vue.js 模板编译过程，这次我们的模板将包含动态和静态部分。
<div id="app">
  <h1>Welcome to My Vue App</h1>
  <p>{{ message }}</p>
</div>;

// 通过 parse 函数解析为一个 AST
ast = {
  tag: "div",
  type: 1,
  attrsList: [{ name: "id", value: '"app"' }],
  children: [
    {
      tag: "h1",
      type: 1,
      children: [
        {
          type: 3,
          text: "Welcome to My Vue App",
        },
      ],
    },
    {
      tag: "p",
      type: 1,
      children: [
        {
          type: 2,
          expression: "message",
          text: "{{ message }}",
        },
      ],
    },
  ],
};

// optimize 函数遍历 AST，标记静态根节点。在这个过程中，它会识别出 <h1> 是一个静态节点。
// 假设标记信息直接加在节点上，实际的实现可能有所不同
ast = {
  // ...div节点信息
  staticRoot: false, // div 不是静态根，因为它包含动态子节点
  children: [
    {
      // ...h1节点信息
      static: true,
    },
    {
      // ...p节点信息
      static: false,
    },
  ],
};

// generate 函数将 AST 转换为渲染函数的代码字符串。考虑到优化，静态节点 <h1> 的渲染逻辑可能被提取到 staticRenderFns 中，而动态节点 <p> 的渲染逻辑将出现在 render 函数中。
// 生成的渲染函数代码（简化版）
result = {
  render: `with(this){return _c('div',{attrs:{"id":"app"}},[_m(0),_v(" "),_c('p',[_v(_s(message))])])}`,
  staticRenderFns: [
    `with(this){return _c('h1',[_v("Welcome to My Vue App")])}`,
  ],
};
// _c 是创建元素的帮助方法，
// _m 引用 staticRenderFns 中的静态渲染函数，
// _v 是创建文本节点的帮助方法，
// _s 是将表达式转换为字符串的帮助方法。
// _m(0) 引用了第一个（索引为 0）静态渲染函数，即 <h1> 标签的渲染逻辑。

// 静态部分 (<h1>Welcome to My Vue App</h1>) 被提取到 staticRenderFns 中，因为它在组件的多次渲染之间不会改变。
// 动态部分 (<p>{{ message }}</p>) 出现在 render 函数中，因为它依赖于组件的数据。每次组件数据变化时，动态部分都会重新渲染。

// _s 实现原理
function _s(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}
