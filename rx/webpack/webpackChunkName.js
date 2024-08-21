/**
 * 解释：
解析和处理 AST：

使用 acorn 解析 JavaScript 代码的抽象语法树（AST）。
遍历 AST 节点，查找 import() 语法的调用（CallExpression）。
对于每个 import() 语句，提取路径，并检查是否有类似 webpackChunkName 的魔法注释。
处理魔法注释：

使用正则表达式匹配 webpackChunkName 魔法注释。如果没有提供 chunk 名称，则使用默认的模块文件名。
这个步骤类似于 Webpack 解析魔法注释的机制。
生成独立的 chunk 文件：

根据指定的 chunkName 或默认的模块路径生成 chunk 文件的文件名。
读取被动态导入的模块的代码，并将其写入到一个独立的 chunk 文件中（模拟独立打包）。
修改入口文件代码：

使用 magic-string 库对源代码进行修改，替换原本的 import() 语句，将其改为使用生成的 chunk 文件名进行动态加载。
输出结果：

最终的入口文件（main.js）被写入 dist 目录中，并且会包含对新生成的 chunk 文件的异步导入。
生成的 chunk 文件（如 async-component.js）会被写入到 dist 目录中，并且包含动态导入模块的代码。
 */

const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const MagicString = require("magic-string");

// 模拟一个编译函数，解析代码中的动态导入并生成 chunk
function compileAndSplitChunks(entryFile) {
  const code = fs.readFileSync(entryFile, "utf-8");

  // 使用 MagicString 来处理源代码的变更
  const magicString = new MagicString(code);

  // 使用 Acorn 解析源代码中的 AST
  const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: "module" });

  // 遍历 AST 节点，查找动态导入语句
  ast.body.forEach((node) => {
    if (
      node.type === "ImportDeclaration" ||
      node.type === "ExpressionStatement"
    ) {
      // 处理 import() 语法
      if (
        node.expression &&
        node.expression.type === "CallExpression" &&
        node.expression.callee.type === "Import"
      ) {
        const importArg = node.expression.arguments[0];
        if (importArg.type === "Literal") {
          const modulePath = importArg.value;

          // 解析魔法注释
          const chunkNameMatch = /webpackChunkName:\s*"(.+?)"/.exec(
            code.slice(node.start, node.end)
          );
          let chunkName = chunkNameMatch ? chunkNameMatch[1] : null;

          // 如果没有指定 chunkName，则使用默认规则生成
          if (!chunkName) {
            chunkName = path.basename(modulePath, path.extname(modulePath));
          }

          // 创建一个独立的 chunk 文件
          const chunkFileName = `${chunkName}.js`;
          const chunkCode = fs.readFileSync(
            path.resolve(path.dirname(entryFile), modulePath),
            "utf-8"
          );

          // 将 chunk 代码写入到输出目录中
          fs.writeFileSync(
            path.resolve(__dirname, "dist", chunkFileName),
            chunkCode,
            "utf-8"
          );

          // 修改入口文件的 import() 语句为异步加载的形式
          magicString.overwrite(
            node.start,
            node.end,
            `import('${chunkFileName}')`
          );
        }
      }
    }
  });

  // 输出修改后的主文件代码
  const transformedCode = magicString.toString();
  fs.writeFileSync(
    path.resolve(__dirname, "dist", "main.js"),
    transformedCode,
    "utf-8"
  );
}

// 假设我们的入口文件是 main.js，手动模拟构建
compileAndSplitChunks("./src/main.js");

/**
 * 假设 main.js 中有以下代码：
 * const loadComponent = () => import(\/* webpackChunkName: "async-component" *\/ './components/AsyncComponent.js');
 这个代码会在解析后生成两个文件：

 dist/main.js：
 这个文件中的 import() 语句会被修改为：
 const loadComponent = () => import('async-component.js');
 dist/async-component.js：
 这个文件包含 AsyncComponent.js 的内容，作为独立的 chunk 文件。
 */
