# 目前监听事件有哪些？

- click、change、mousedown

# 点击页面一个元素会触发它的哪些事件？

1. mousedown
2. focus(不可聚焦元素如 div 不会触发)-该事件不会冒泡
3. focusin-与 focus 类似，但是冒泡事件
4. mouseup
5. click
6. dbclick（两次 click 事件后触发，如果单击操作该事件不会触发）

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Event Order</title>
</head>
<body>
    <button id="testButton">Click me</button>

    <script>
        const button = document.getElementById('testButton');

        button.addEventListener('mousedown', () => console.log('mousedown'));
        button.addEventListener('focus', () => console.log('focus'));
        button.addEventListener('focusin', () => console.log('focusin'));
        button.addEventListener('mouseup', () => console.log('mouseup'));
        button.addEventListener('click', () => console.log('click'));
        button.addEventListener('dblclick', () => console.log('dblclick'));
    </script>
</body>
</html>
```

# 在 Puppeteer 中，使用 click 方法触发元素的点击操作时，它会自动触发该元素的所有相关事件?

- 如果元素上绑定了这些事件的回调函数，这些回调函数都会被依次触发。

# mousedown、mouseup、focus、focusin 和 click 事件都有冒泡和捕获吗

- focus 事件不支持冒泡，但支持捕获。如果需要在 focus 事件上处理冒泡行为，可以使用 focusin 事件代替。

# 当 inputA 聚焦且其值已改变，然后点击 divB 时，事件的触发顺序如下

- 总的来说，focus 和 focusin 事件在 mousedown 之前触发，而 change 事件紧随其后，然后是 blur 和 focusout 事件，最后是 mouseup 和 click 事件。

1. divB focus
2. divB focusin
3. divB mousedown
4. inputA change
5. inputA blur
6. inputA focusout
7. divB mouseup
8. divB click

# 如何使用 Puppeteer 来触发 mousedown?

- 虽然没有一个单独的 API 类似于 click 直接触发 mousedown 事件，但你可以组合使用这些 API 来实现触发鼠标事件的效果。

```
    const buttonSelector = '#testButton';

    // 在浏览器上下文中执行 JavaScript 代码
    await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        // 创建新的鼠标事件
        const event = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event); // 在目标元素上触发该事件。
    }, buttonSelector);
```

- 另一种方法：使用 page.mouse API

```
    const buttonSelector = '#testButton';
    const button = await page.$(buttonSelector); // 选择目标元素
    const boundingBox = await button.boundingBox(); // 获取元素的边界框信息

    // 将鼠标移动到目标元素的中心位置
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down(); // 触发 mousedown
```
