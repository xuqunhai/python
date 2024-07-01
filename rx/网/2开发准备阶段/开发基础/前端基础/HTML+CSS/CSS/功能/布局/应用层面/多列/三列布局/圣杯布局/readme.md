# 当将三个容器拉到同一行时，圣杯布局是调整左右容器的位置，用相对定位的方式将左右容器移出中间容器，同时再给最外层容器一个内边距，防止覆盖中间容器。

# 三列布局，其中中间列的内容优先展示，左右两侧的列高度自适应。
```
<div class="container">
  <div class="main">Main Content</div>
  <div class="left">Left Sidebar</div>
  <div class="right">Right Sidebar</div>
</div>

.container {
  display: flex;
  flex-direction: row;
}

.main {
  flex: 1;
  margin: 0 200px; /* 留出左右两栏的宽度 */
}

.left, .right {
  width: 200px;
  position: relative;
}

.left {
  margin-left: -100%; /* 移到主栏的左边 */
  right: 200px; /* 向右调整宽度 */
}

.right {
  margin-right: -100%; /* 移到主栏的右边 */
  left: 200px; /* 向左调整宽度 */
}
```

# 百分比值相对的参考对象
- 宽度是相对于包含块（containing block）的宽度计算的。
- 高度也是相对于包含块的高度计算的。如果包含块的高度未被显式设置（例如，没有明确的 height 值），那么百分比高度将不起作用。
- padding 相对于包含块的宽度计算。
- margin 相对于包含块的宽度计算。
- left 和 right 的百分比值相对于包含块的宽度计算。
- top 和 bottom 的百分比值相对于包含块的高度计算。