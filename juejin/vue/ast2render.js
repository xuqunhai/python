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
