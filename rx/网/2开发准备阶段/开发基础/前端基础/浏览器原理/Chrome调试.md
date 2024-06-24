# 打开devTool
- 快捷键 F12

# 打开命令菜单
- 快捷键：Command+Shift+P(MAC)
- 作用
   - 主题切换：主题/Theme
   - 截屏：截屏/screenshot（自定义截取/截取全文档/截取某节点）
   - 是否开启代码折叠功能：代码/code folding

# 调试面板
- 转成手机模式后，可模拟旋转屏幕
- 打开调试面板后按 cmd+P 可唤起命令行模式，可输入?查看可用命令(如打开文件/转到行)
- 通过console面板执行inspect(selector)可以跳到Elements面板定位到selector元素
- Elements面板按 cmd+F 可查找元素，可通过xpath，如 //section/p，xpath里//表示全局搜索
- Elements面板对元素右键选【Break on】可在该元素属性改变或该元素被移除或该元素subtree有变化时，打断点
- 让hover常驻：打开elements面板下styles子面板，点击对应元素:hover然后勾选子面板的:hover即可
- 去掉元素某个class：打开elements面板下styles子面板，点击对应元素:cls然后去掉对应class即可
- 复制某个元素样式：右键-复制-styles
- elements面板下styles子面板的computed子面板勾选组合会分成：Layout/Text/Appearance/Other
- elements面板下layout面板会把使用Grid/Flex布局元素都汇总

# Console面板
- $_ 返回上一条语句执行结果
- $0/$1/... 返回上一个选择的DOM节点
- console.time/timeEnd可计算代码执行时间
- console.trace查看调用堆栈
- 小眼睛可对变量进行值跟踪
- Logs级别筛选（某类型log不想看到）
- 复杂对象的复制：copy(obj) 可实现直接复制到剪切板
- 直接控制台安装npm包：安装Console Importer插件，执行$i('dayjs')安装dayjs，这样就可控制台调用dayjs API

# Sources面板
- Watch子面板右侧+可监听某变量
- 可查看断点的类型，如debugger/xhr/DOM/event BreakPoints，其中如果想给click事件打断点，可在Event Listener BreakPoints里找Mouse里面click勾选，如果有些文件不想触发断点，可在Call Back子面板里找到文件后右键设置【Add script to ignore list】；
- 如果在循环体或者条件判断中，只想在特定条件去打断点，可以在该行代码右键选择【添加条件断点】后输入条件表达式即可

# Network面板
- 录制网络日志按钮默认开启，否则无法看到任何请求
- 保留日志、停用缓存和切换网络是常用功能
- wifi图标点击后可进行更多网络状况设置，如自定义ua
- 导出HAR文件和导入HAR文件可协助分析问题或性能，如PC用户反馈偶现问题，可让其导出HAR文件后，开发导入即可还原当时请求情况，即每个请求的不同阶段的时间数据，比如DNS解析时间、连接时间、请求发送时间、等待时间和响应接收时间等。这些详细的时间数据对于分析页面加载性能非常重要。
- puppeteer-har包可实现导出HAR文件，Android/iOS可间接实现，但仍可能存在一些无法完全消除的差异
- 重新发送某个请求：找到该请求右键选择【Replay XHR】
- 修改某请求参数后再次请求：对该请求右键选择【Copy - Copy as fetch】，然后到console面板黏贴，最后按需修改完成回车即可