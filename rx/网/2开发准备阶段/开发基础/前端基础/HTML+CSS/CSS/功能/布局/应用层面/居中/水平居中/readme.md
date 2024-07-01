# 内联（inline）级别 父容器设置
```
    .inline {
      text-align: center;
    }
```
# 块（block）级别  自身设置
```
    .block {
			margin-left: auto;
      margin-right: auto;
    }
```
# flex布局级别+多子容器  父容器设置
```
    .flex {
      display: flex;
			justify-content: center;
    }
```
# 定位级别+脱离文档流+不定宽  自身设置
```
    .position {
      position: absolute;
      left: 50%;
      transform: translateX(-50%); // 存在多浏览器兼容性问题，所以需要写多套
    }
```
# 定位级别+脱离文档流+定宽  自身设置
```
    .position-mixin (@width:100%) {
      position: absolute;
      left: 50%;
      margin-left: -@width/2;
    }
```
# 定位级别+脱离文档流+包裹性 （最佳方案）  自身设置
```
    .position-wrap {
      position: absolute;
      left: 0;
      right: 0;
			margin: 0 auto;
    }
```