/* @flow */
// 匹配任何单个的字母（无论大小写）、数字、下划线 (_)、右括号 ())、点 (.)、加号 (+)、短横线 (-)、美元符号 ($)、或右方括号 (]) 字符。
const validDivisionCharRE = /[\w).+\-_$\]]/;

// 从一个表达式字符串中提取出过滤器，并将这些过滤器应用到表达式上
/*
{{ message | filterA | filterB('arg1', arg2) }}
const exp = "message | filterA | filterB('arg1', arg2)";
const result = parseFilters(exp);
"_f('filterB')(_f('filterA')(message),'arg1',arg2)"
*/
export function parseFilters(exp: string): string {
  let inSingle = false;
  let inDouble = false;
  let inTemplateString = false;
  let inRegex = false;
  // 及括号、方括号和花括号的计数器
  let curly = 0;
  let square = 0;
  let paren = 0;
  // 追踪最后一个过滤器的位置
  let lastFilterIndex = 0;
  // c, prev 存储当前和之前的字符代码
  // expression 存储过滤器之前的表达式部分
  let c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    /*
    返回指定位置的字符Unicode编码
    应用：
    判断字符串是否为大写
    return code >= 65 && code <= 90; // 'A' 的编码为 65，'Z' 的编码为 90
    实现简单的加密解密
    return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    字符串排序
    return a.charCodeAt(i) - b.charCodeAt(i)
    */
    /*
    单引号 charCodeAt 是39，转成16进制就是0x27，
    "'".charCodeAt(0).toString(16); // 27
    即39 === 0x27; true
    */
    if (inSingle) {
      // 当前在单引号字符串中
      // 当前字符是否是单引号且前一个字符不是反斜杠
      // 退出单引号字符串状态
      if (c === 0x27 && prev !== 0x5c) inSingle = false;
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5c) inDouble = false;
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5c) inTemplateString = false;
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5c) inRegex = false;
    } else if (
      c === 0x7c && // pipe
      exp.charCodeAt(i + 1) !== 0x7c &&
      exp.charCodeAt(i - 1) !== 0x7c &&
      !curly &&
      !square &&
      !paren
    ) {
      // 如果当前字符是管道符（|），且前后字符不是管道符，同时不在任何类型的括号内，认为遇到了过滤器的分隔符。
      if (expression === undefined) {
        // 第一个过滤器
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22:
          inDouble = true;
          break; // "
        case 0x27:
          inSingle = true;
          break; // '
        case 0x60:
          inTemplateString = true;
          break; // `
        case 0x28:
          paren++;
          break; // (
        case 0x29:
          paren--;
          break; // )
        case 0x5b:
          square++;
          break; // [
        case 0x5d:
          square--;
          break; // ]
        case 0x7b:
          curly++;
          break; // {
        case 0x7d:
          curly--;
          break; // }
      }
      // 如果当前字符是斜杠
      if (c === 0x2f) {
        // /
        let j = i - 1;
        let p;
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== " ") break;
        }
        // 精确地区分表达式中的斜杠是作为正则表达式的定界符还是作为除法操作符
        // 斜杠（/）前的字符是数字 3，这明显是一个除法操作的情况。
        // 斜杠（/）前的是一个赋值操作符（=），这是一个允许正则表达式出现的上下文
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter() {
    // 提取过滤器
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression;
}

// 将 Vue 模板中的过滤器语法包装成可执行的 JavaScript 表达式字符串
function wrapFilter(exp: string, filter: string): string {
  const i = filter.indexOf("(");
  if (i < 0) {
    // _f 是 Vue 内部用于解析过滤器的函数。
    return `_f("${filter}")(${exp})`;
    // {{ message | capitalize }}
    // wrapFilter("message", "capitalize");
    // _f("capitalize")(message)
  } else {
    // 找到了左括号，说明过滤器带有参数。
    const name = filter.slice(0, i); // 过滤器名称
    const args = filter.slice(i + 1); // 参数
    return `_f("${name}")(${exp}${args !== ")" ? "," + args : args}`;
    // {{ birthday | formatDate('YYYY-MM-DD') }}
    // wrapFilter("birthday", "formatDate('YYYY-MM-DD')");
    // _f("formatDate")(birthday,'YYYY-MM-DD')

    // {{ value | doSomething() }}
    // wrapFilter("value", "doSomething()");
    // args 将会是 ")"
    // _f("doSomething")(value)
  }
}
