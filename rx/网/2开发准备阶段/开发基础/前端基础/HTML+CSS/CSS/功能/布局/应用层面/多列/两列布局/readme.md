# 左列定宽，右列自适应
- 表格（等高-pc 端推荐）
```
  .table-mixin (@leftWidth: 0) {
    display: table;
    width: 100%;
    .left {
      display: table-cell;
      width: @leftWidth;
    }
    .right {
      display: table-cell;
    }
  }
```

- flex 布局（等高-移动端推荐）
```
.flex-mixin (@leftWidth: 0) {
  display: flex;
  .left {
    width: @leftWidth;
  }
  .right {
    flex: 1;
  }
}
```

- 定位（需要脱离文档流）
```
  .position-mixin (@leftWidth: 0) {
    position: relative;
    .left {
      position: absolute;
      width: @leftWidth;
    }
    .right {
      position: absolute;
      left: @leftWidth;
      right: 0;
    }
  }
```

- 浮动：组合 BFC（可以overflow或display: flex；都会有副作用，需要考虑场景使用）
// 适合 PC 端  父容器  均浮动（最佳方案）
```
.float-bfc-mixin (@leftWidth: 0) {
  .left,
  .right-fix {
    float: left;
  }
  .left {
    width: @leftWidth;
  }
  .right {
    display: flex;
    // 或 overflow: hidden;
  }
}
```

- gird 布局 适合不需要考虑兼容性的布局（目前更建议使用 flex）  父容器
```
.gird-mixin (@leftWidth: 0) {
  display: grid;
  grid-template-columns: @leftWidth auto; // 列宽
  grid-template-rows: repeat(2, 600px); // 列高
}
```