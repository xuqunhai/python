// 1、解决上报 js 错误到 papm 平台的函数自身发生报错时处理不当问题；
// 问题：

// "TypeError: Converting circular structure to JSON\n    --> starting at object with constructor 'Sr'\n    |     property '$options' -> object with constructor 'Object'\n    |     property 'router' -> object with constructor 'xe'\n    --- property 'app' closes the circle"

var grandparent = { name: "Grandpa" };
var parent = { name: "Dad", grandparent: grandparent };
var child = { name: "Son", parent: parent };
grandparent.parent = parent; // 创建循环引用

// console.log(JSON.stringify(obj));
console.log(stringify(child));
/*
keys []
stack 1
splice thisPos 0
keys [ 'name' ]
stack 1
splice thisPos 0
keys [ 'parent' ]
stack 1
push thisPos -1
keys [ 'parent', 'name' ]
stack 2
splice thisPos 1
keys [ 'parent', 'grandparent' ]
stack 2
push thisPos -1
keys [ 'parent', 'grandparent', 'name' ]
stack 3
splice thisPos 2
keys [ 'parent', 'grandparent', 'parent' ]
stack 3
{"name":"Son","parent":{"name":"Dad","grandparent":{"name":"Grandpa","parent":"[Circular ~.parent]"}}}
*/

function stringify(obj, replacer, spaces, cycleReplacer) {
  //   console.log("start======stringify fn starting", obj); // 执行一次
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
}

function serializer(replacer, cycleReplacer) {
  console.log("===========serializer fn starting"); // 执行一次
  // stack 用来追踪对象及其子对象的引用（以检测循环引用），而 keys 用来存储相应的键路径（帮助生成循环引用的路径描述）。
  var stack = [],
    keys = [];
  if (cycleReplacer == null)
    cycleReplacer = function (key, value) {
      // 如果栈的第一个元素（即根对象）就是当前值，表示存在直接的循环引用，返回表示循环引用的字符串
      // 一个对象直接引用了自身obj.self = obj;
      if (stack[0] === value) return "[Circular ~]"; // 第一个
      // 如果当前值是深层的循环引用，构造并返回一个描述该循环引用路径的字符串。
      return (
        "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
      );
    };
  return function (key, value) {
    // 每个 key 执行一次，深度遍历
    if (stack.length > 0) {
      // 如果不为空，说明当前正在处理一个对象或数组的子项。
      // 在整个序列化过程中，this 的值会根据当前正在序列化的属性的父对象而变化。它并不是固定的
      var thisPos = stack.indexOf(this);
      if (~thisPos) {
        // 使用位运算 ~ 转换为真值
        // 找到
        stack.splice(thisPos + 1); // 移除当前位置之后的所有元素，这表示截断循环引用。
        keys.splice(thisPos, Infinity, key); // 从 keys 中移除与 stack 同样的范围的元素，并在相应位置插入当前键
        console.log("splice thisPos", thisPos);
      } else {
        // 找不到 - 开始追踪一个新对象的子项。
        stack.push(this);
        keys.push(key);
        console.log("push thisPos", thisPos);
      }
      // 找到
      // 如果当前的值（value）已存在于 stack 中，说明发现了循环引用。
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
    } else stack.push(value);
    // console.log("stack", stack);
    console.log("keys", keys);
    console.log("stack", stack.length);
    // console.log("thisPos", thisPos, "this", this, key, JSON.stringify(keys));
    return replacer == null ? value : replacer.call(this, key, value);
  };
}

// JSON.stringify(value[, replacer[, space]])

// 如果指定了一个 replacer 函数，则可以选择性地替换值，被序列化的值的每个属性都会经过该函数的转换和处理；

// 作为函数，它有两个参数，键（key）和值（value），它们都会被序列化。

// 在开始时，replacer  函数会被传入一个空字符串作为  key  值，代表着要被  stringify  的这个对象。随后每个对象或数组上的属性会被依次传入。

// - 如果返回 undefined，该属性值不会在 JSON 字符串中输出。

// 如果返回任何其他对象，该对象递归地序列化成 JSON 字符串，对每个属性调用 replacer 方法。

// Space 指定缩进用的空白字符串，用于美化输出
