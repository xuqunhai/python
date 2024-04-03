/* @flow */
/*
// 开头是一个或多个字符（字母或美元或下划线）或者是一对小括号，且括号内没有右括号；然后后面有无空格，接着是箭头
// 开头是function，接着【至少一个空格，接着至少一个字母或美元符号】，后面任意空格，最后左括号
var arr = ['fasdf =>', 'fasd=>', '()=>', '(afd) =>', 'function(', 'function  (', 'function  a (', 'function $(]']
 */
const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
/* 
一对小括号，且括号内没有右括号；结尾匹配任意个分号，越少越好
['();', '()', '();;', '( )', '(asdf)']
*/
const fnInvokeRE = /\([^)]*?\);*$/;
/*
// 开头是 字母或下划线或美元，然后字母或数字或下划线或美元 任意个；后面就是结尾，结尾以匹配任意分支（下面5种），越少越好
// 1、一个点，字母或下划线或美元，然后字母或数字或下划线或美元 任意个，或者
// 2、一对中括号，里面一对单引号，再里面任意个非单引号字符，或者
// 3、一对中括号，里面一对双引号，再里面任意个非双引号字符，或者
// 4、一对中括号，里面至少一个数字，或者
// 5、一对中括号，里面 字母或下划线或美元，然后字母或数字或下划线或美元 任意个
var arr3 = ['a', 'aa1', 'a1.$', 'a1.$$$', "a['vv']", 'a["v"]', 'a[1]', 'a.$[_]', 'a.$[_$]']
*/
const simplePathRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
const keyCodes: { [key: string]: number | Array<number> } = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46],
};

// KeyboardEvent.key aliases
const keyNames: { [key: string]: string | Array<string> } = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ["Esc", "Escape"],
  tab: "Tab",
  enter: "Enter",
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [" ", "Spacebar"],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ["Up", "ArrowUp"],
  left: ["Left", "ArrowLeft"],
  right: ["Right", "ArrowRight"],
  down: ["Down", "ArrowDown"],
  // #9112: IE11 uses `Del` for Delete key name.
  delete: ["Backspace", "Delete", "Del"],
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
const genGuard = (condition) => `if(${condition})return null;`;

const modifierCode: { [key: string]: string } = {
  stop: "$event.stopPropagation();",
  prevent: "$event.preventDefault();",
  self: genGuard(`$event.target !== $event.currentTarget`),
  ctrl: genGuard(`!$event.ctrlKey`),
  shift: genGuard(`!$event.shiftKey`),
  alt: genGuard(`!$event.altKey`),
  meta: genGuard(`!$event.metaKey`),
  left: genGuard(`'button' in $event && $event.button !== 0`),
  middle: genGuard(`'button' in $event && $event.button !== 1`),
  right: genGuard(`'button' in $event && $event.button !== 2`),
};

export function genHandlers(
  events: ASTElementHandlers,
  isNative: boolean
): string {
  // 原生 DOM 事件 (nativeOn:) 还是组件自定义事件 (on:)
  const prefix = isNative ? "nativeOn:" : "on:";
  let staticHandlers = ``;
  let dynamicHandlers = ``;
  for (const name in events) {
    // 生成当前事件处理函数的代码。
    const handlerCode = genHandler(events[name]);
    if (events[name] && events[name].dynamic) {
      // v-on:[eventName]="handler"
      dynamicHandlers += `${name},${handlerCode},`;
    } else {
      staticHandlers += `"${name}":${handlerCode},`;
    }
  }
  staticHandlers = `{${staticHandlers.slice(0, -1)}}`;
  if (dynamicHandlers) {
    /*
    _d处理
    // 遍历动态绑定的数组
    for (let i = 0; i < dynamicBindings.length; i += 2) {
      const key = dynamicBindings[i]; // 动态绑定的键（属性名或事件名）
      const value = dynamicBindings[i + 1]; // 动态绑定的值（属性值或事件处理函数）
      // 将动态键和值应用到静态绑定对象上
      staticBindings[key] = value;
    }
    */
    return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`;
  } else {
    return prefix + staticHandlers;
  }
  /*
  <!-- 静态事件监听 -->
  <button @click="onClick">Click Me</button>
  on:{"click":function(){}}。
  <!-- 动态事件监听 -->
  <button @[dynamicEvent]="onDynamicEvent">Dynamic Event</button>
  on:_d({"click":function(){}},["mouseover",function(){},])
  */
}

// Generate handler code with binding params on Weex
/* istanbul ignore next */
function genWeexHandler(params: Array<any>, handlerCode: string) {
  let innerHandlerCode = handlerCode;
  const exps = params.filter(
    (exp) => simplePathRE.test(exp) && exp !== "$event"
  );
  const bindings = exps.map((exp) => ({ "@binding": exp }));
  const args = exps.map((exp, i) => {
    const key = `$_${i + 1}`;
    innerHandlerCode = innerHandlerCode.replace(exp, key);
    return key;
  });
  args.push("$event");
  return (
    "{\n" +
    `handler:function(${args.join(",")}){${innerHandlerCode}},\n` +
    `params:${JSON.stringify(bindings)}\n` +
    "}"
  );
}

function genHandler(
  handler: ASTElementHandler | Array<ASTElementHandler>
): string {
  if (!handler) {
    // 没有处理器
    return "function(){}";
  }

  /* <button @click="[methodOne, methodTwo]">Click Me</button>
  // "[(function($event){return methodOne($event)}),(function($event){return methodTwo($event)})]"
  */
  if (Array.isArray(handler)) {
    return `[${handler.map((handler) => genHandler(handler)).join(",")}]`;
  }

  const isMethodPath = simplePathRE.test(handler.value);
  const isFunctionExpression = fnExpRE.test(handler.value);
  const isFunctionInvocation = simplePathRE.test(
    handler.value.replace(fnInvokeRE, "")
  );

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value;
    }
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, handler.value);
    }
    return `function($event){${
      isFunctionInvocation ? `return ${handler.value}` : handler.value
    }}`; // inline statement
  } else {
    let code = "";
    let genModifierCode = "";
    const keys = [];
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === "exact") {
        const modifiers: ASTModifiers = (handler.modifiers: any);
        genModifierCode += genGuard(
          ["ctrl", "shift", "alt", "meta"]
            .filter((keyModifier) => !modifiers[keyModifier])
            .map((keyModifier) => `$event.${keyModifier}Key`)
            .join("||")
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    const handlerCode = isMethodPath
      ? `return ${handler.value}.apply(null, arguments)`
      : isFunctionExpression
      ? `return (${handler.value}).apply(null, arguments)`
      : isFunctionInvocation
      ? `return ${handler.value}`
      : handler.value;
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, code + handlerCode);
    }
    return `function($event){${code}${handlerCode}}`;
  }
}

function genKeyFilter(keys: Array<string>): string {
  return (
    // make sure the key filters only apply to KeyboardEvents
    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
    // key events that do not have keyCode property...
    `if(!$event.type.indexOf('key')&&` +
    `${keys.map(genFilterCode).join("&&")})return null;`
  );
}

function genFilterCode(key: string): string {
  const keyVal = parseInt(key, 10);
  if (keyVal) {
    return `$event.keyCode!==${keyVal}`;
  }
  const keyCode = keyCodes[key];
  const keyName = keyNames[key];
  return (
    `_k($event.keyCode,` +
    `${JSON.stringify(key)},` +
    `${JSON.stringify(keyCode)},` +
    `$event.key,` +
    `${JSON.stringify(keyName)}` +
    `)`
  );
}
