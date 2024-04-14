var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/
//  (?:)这个代表不捕获分组
// ?跟在*或者+后边用时，表示懒惰模式。
// + 至少1个
// ? 最多1个
// * 任意个

// 开头是一个或多个字符（字母或美元或下划线）或者是一对小括号，且括号内没有右括号；然后后面有无空格，接着是箭头
// fasdf =>
// fasd=>
// ()=>
// (afd) =>
// 开头是function，接着【至少一个空格，接着至少一个字母或美元符号】，后面任意空格，最后左括号
// function(
// function  (
// function  a (
// function $(
var arr = ['fasdf =>', 'fasd=>', '()=>', '(afd) =>', 'function(', 'function  (', 'function  a (', 'function $(]']
// 要求匹配开头，不要求匹配到最后结尾
arr.map(str => fnExpRE.test(str)) // [true, true, true, true, true, true, true, true]

var fnInvokeRE = /\([^)]*?\);*$/
// 一对小括号，且括号内没有右括号；结尾匹配任意个分号，越少越好
var arr2 = ['();', '()', '();;', '( )', '(asdf)']
// 不要求匹配开头，要求匹配到最后结尾
arr2.map(str => fnInvokeRE.test(str)) // [true, true, true, true, true]

var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/
// 开头是 字母或下划线或美元，然后字母或数字或下划线或美元 任意个；后面就是结尾，结尾以匹配任意分支（下面5种），越少越好
// 1、一个点，字母或下划线或美元，然后字母或数字或下划线或美元 任意个，或者
// 2、一对中括号，里面一对单引号，再里面任意个非单引号字符，或者
// 3、一对中括号，里面一对双引号，再里面任意个非双引号字符，或者
// 4、一对中括号，里面至少一个数字，或者
// 5、一对中括号，里面 字母或下划线或美元，然后字母或数字或下划线或美元 任意个
var arr3 = ['a', 'aa1', 'a1.$', 'a1.$$$', "a['vv']", 'a["v"]', 'a[1]', 'a.$[_]', 'a.$[_$]']
// 要求匹配开头，要求匹配到最后结尾
arr3.map(str => simplePathRE.test(str)) // [true, true, true, true, true, true, true, true, true]
