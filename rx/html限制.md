# HTML 规范确实定义了哪些元素不能嵌套在其他特定元素内部[a/p/li/table/dt/dd]
- a 元素不得嵌套在 a 元素内: HTML5 明确禁止将一个锚点（a）元素嵌套在另一个锚点元素内部。
- 块级元素与内联元素: 一些HTML元素被定义为块级（block-level）元素，而其他的则是内联（inline）元素。虽然HTML5较为宽松，允许大多数块级元素嵌套在内联元素内部，但这- 种嵌套通常不是最佳实践。特别是，p 元素不能包含块级元素，如 div、section 或其他 p 元素。
- 特定内容模型的限制: 某些元素被设计为只能包含特定类型的子元素。例如，ul、ol 和 menu 只能包含 li、script 或 template 元素作为直接子元素。
- table 元素的子元素: table 元素有严格的子元素规则。它应该只包含 caption、colgroup、thead、tbody、tfoot 和 tr 元素。类似地，tr 元素只能包含 td 或 th 元素。如果table里直接写文字，通过选择器可能无法获取设置文字样式。
- head 和 body 的内容: head 元素应该只包含为文档提供元数据的元素，如 title、style、meta、link、script、noscript 和 base。而 body 元素则包含文档的可见内容。将 body 元素的内容错误地放入 head 中，或者在 body 中使用仅供 head 使用的元素，都是不符合规范的。
- li, dt, 和 dd 的父元素: li 元素应该仅包含在 ul、ol 或 menu 中；而 dt（定义项目标题）和 dd（定义项目描述）应该仅包含在 dl（定义列表）中。