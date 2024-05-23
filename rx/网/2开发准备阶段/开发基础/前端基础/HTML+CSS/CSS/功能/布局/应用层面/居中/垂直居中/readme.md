# 内联（inline）级别+已知高度  父容器设置  需要固定高度
```
// 父容器设置line-height
.inline-mixin (@line-height) {
  line-height: @line-height;
}
// mixin 是 Less 中的一种强大的功能，允许你定义一组样式，然后在其他地方重用它们。
// .inline-mixin (@line-height): 这是一个 mixin 定义。@line-height 是这个 mixin 的参数
// 在 Less 中，变量通常用 @ 符号开始。
@default-line-height: 1.5;
.header {
  .inline-mixin(@default-line-height);
}
// 将编译为以下 CSS：
.header {
  line-height: 1.5;
}
```
# flex布局级别+多子容器  父容器设置  兼容性
```
.flex {
  display: flex;
  align-items: center;
}
```
# 定位级别+脱离文档流+不定宽  自身设置  会脱离文档流+兼容性
```
.position {
  position: absolute;
  top: 50%;
  transform: translateY(-50%); // 存在多浏览器兼容性问题，所以需要写多套
}
```
# 定位级别+脱离文档流+定高  自身设置  会脱离文档流且需要定宽
```
.position-mixin (@height : 100%) {
  position: absolute;
  top: 50%;
  margin-top: -@height/2;
}
```
# 定位级别+脱离文档流+包裹性 （最佳方案）  自身设置  会脱离文档流
```
.position-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
```