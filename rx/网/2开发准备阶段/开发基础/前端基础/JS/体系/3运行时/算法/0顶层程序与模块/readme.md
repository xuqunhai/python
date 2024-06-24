# 结论不正确 —— 当 JavaScript 脚本在 HTML 文档中以阻塞方式（即没有异步或延迟属性）加载时，它必须在浏览器继续解析后面的 HTML（包括其中的 CSS 链接）之前先被完全下载和执行
```
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="./1.js"></script>
  <script>
    var i = 0
    while(i<10000) {
      i++;
      console.log('while')
    }
  </script>
  <script src="./2.js"></script>
  <style>
    .body {
      background-color: green!important;
    }
  </style>
  <script>
    var i = 0
    while(i<10000) {
      i++;
      console.log('while2')
    }
  </script>
  <link rel="stylesheet" href="./1.css">
</head>
```
## 上面代码其中1.css内容是#body {background-color: blue!important;}；为什么在chrome浏览器当while循环没执行完页面背景就已经是蓝色？
- 在现代浏览器（如 Chrome）中，资源的下载往往是并行进行的，即使其在 DOM 构建或 JavaScript 执行阶段尚未被应用。这意味着，CSS 文件可能在 JavaScript 执行的同时就已经下载完成了。
- 浏览器在处理 JavaScript 和 CSS 时，有时会采取一些优化措施以改善用户体验。例如，即使 JavaScript 代码在执行，一旦 CSS 文件下载完成，浏览器可能会选择在适当的时机应用这些样式，尤其是在脚本执行过程中如果有浏览器的 UI 重绘机会时。
- while 循环尽管执行了很多次，但它们的执行速度非常快，因此可能在浏览器还没来得及显示页面之前就已经完成了。如果 1.css 在这些脚本之间已经被下载（这在现代浏览器中是很可能的），那么浏览器可能在渲染页面时直接应用了这个 CSS 文件，从而导致页面背景显示为蓝色。**这个结论不太对，因为while里有打印，是在打印过程中，出现背景色的，也就证明js没执行完成**