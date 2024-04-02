// 保存原始的addEventListener方法
const originalAddEventListener = Element.prototype.addEventListener;

// 重写addEventListener方法
Element.prototype.addEventListener = function (type, listener, options) {
  console.log(`Event listener added: ${type}`); // 自定义逻辑：记录添加的事件类型

  // 调用原始的addEventListener方法以保持原有功能
  originalAddEventListener.call(this, type, listener, options);
};

// 测试重写后的方法
document.querySelector("button").addEventListener("click", () => {
  console.log("Button clicked!");
});
// 请注意，虽然这个技巧在开发和调试时很有用，但它可能会与某些库或框架产生冲突，特别是那些也修改或依赖特定行为的addEventListener方法的库。因此，除非确实需要，否则不建议在生产环境中使用这种方法。此外，在覆盖全局方法时要格外小心，确保不要破坏页面的正常功能。
