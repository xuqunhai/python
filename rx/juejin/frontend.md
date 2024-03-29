# HTML5新特性
1. 语义标签
   - 结构性元素:header/footer/nav/section/article/aside
   - 新的内容元素:figure/figcaption/main/mark
2. 表单控件
   - 新的输入类型: email, date, time, url, search, number
   - 表单属性:placeholder, autofocus, autocomplete, required, pattern
3. 图形和多媒体:Canvas/SVG/video/audio
4. Web存储:localStorage/sessionStorage
5. 离线和网络
   - 离线应用缓存：通过创建一个manifest文件，可以让应用在离线时也能运行。
   - Web Workers：允许在后台线程中运行脚本，提高了页面的性能和响应性。
   - WebSockets：提供了在用户和服务器之间建立一个持久连接的方法，使得实时通讯变得更加高效。
6. 高级APIs
   - 拖放API：允许用户拖放文件从桌面直接到网页中。
   - 地理位置API：允许网站获取用户的地理位置信息。
   - File API：提供了读取本地文件的能力，支持拖放文件操作。
   - History API：允许开发者操作浏览器的会话历史（back、forward按钮）无需重新加载页面。
7. 性能和集成
   - 异步脚本加载：script标签的async和defer属性允许脚本异步加载，减少页面加载时间。
   - CSS3集成：HTML5与CSS3紧密集成，支持更复杂和高性能的样式和动画。
8. 访问性改进
   - ARIA(Accessible Rich Internet Applications)角色和属性：提高了网页的可访问性，使得网站更好地服务于残疾人士。
  
# CSS3新特性
1. 选择器: 属性选择器、结构性伪类选择器（如:nth-child, :last-child）和否定伪类选择器（:not()）等。
2. 盒模型: box-sizing
3. 背景和边框: 多背景、边框图片、圆角边框（border-radius）、阴影（box-shadow, text-shadow）
4. 文本效果: 文本溢出（text-overflow）、字体嵌入（@font-face）、阴影（text-shadow）
5. 2D/3D转换: 旋转（rotate）、缩放（scale）、移动（translate）和倾斜（skew）
6. 动画: 通过@keyframes规则定义动画序列，使用animation属性控制动画的执行。
7. 过渡: transition让元素在不同状态之间平滑过渡
8. 布局: flex/grid
9. 媒体查询: 同的设备特征应用不同的样式规则
10. 颜色: 对HSL、HSLA、RGBA颜色模型的支持