// 模块解析：创建一个包含模块代码、导出和导入信息的对象。
// 标记导出：遍历模块，标记哪些导出是被其他模块引用的。
// 移除未使用的导出：遍历模块代码，移除未标记为使用的导出。

// 模拟模块解析
const modules = {
  "./moduleA.js": {
    code: `
      export function unusedFunction() {
        console.log('This function is not used');
      }

      export function usedFunction() {
        console.log('This function is used');
      }
    `,
    exports: ["unusedFunction", "usedFunction"],
  },
  "./index.js": {
    code: `
      import { usedFunction } from './moduleA.js';

      usedFunction();
    `,
    imports: {
      "./moduleA.js": ["usedFunction"],
    },
  },
};

// 模拟标记导出
function markUsedExports(modules) {
  const usedExports = {};

  for (const modulePath in modules) {
    const module = modules[modulePath];
    if (module.imports) {
      for (const importPath in module.imports) {
        if (!usedExports[importPath]) {
          usedExports[importPath] = new Set();
        }
        module.imports[importPath].forEach((exp) =>
          usedExports[importPath].add(exp)
        );
      }
    }
  }

  return usedExports;
}

// 模拟移除未使用的导出
function shakeTree(modules, usedExports) {
  const newModules = {};

  for (const modulePath in modules) {
    const module = modules[modulePath];
    if (module.exports) {
      const codeLines = module.code.split("\n");
      const newCodeLines = codeLines.filter((line) => {
        const match = line.match(/export function (\w+)/);
        if (match) {
          const functionName = match[1];
          return (
            usedExports[modulePath] && usedExports[modulePath].has(functionName)
          );
        }
        return true;
      });
      newModules[modulePath] = {
        ...module,
        code: newCodeLines.join("\n"),
      };
    } else {
      newModules[modulePath] = module;
    }
  }

  return newModules;
}

// 模拟运行
const usedExports = markUsedExports(modules);
const optimizedModules = shakeTree(modules, usedExports);

// 打印优化后的代码
for (const modulePath in optimizedModules) {
  console.log(`=== ${modulePath} ===`);
  console.log(optimizedModules[modulePath].code);
}
