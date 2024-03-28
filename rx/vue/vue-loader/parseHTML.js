function parseHTML(html, options) {
  const stack = [] // 存放未闭合的标签，确保标签正确嵌套。
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no
  let index = 0 // 跟踪当前解析的位置。
  let last, lastTag // 存储上一次解析的内容和标签名。
  while (html) {
    last = html // 被设置为当前的html字符串，
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<')
      if (textEnd === 0) {
        // Comment: // 处理注释<!-- ... -->
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
            }
            advance(commentEnd + 3)
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        // // 处理条件注释<![if ...]>...<![endif]>
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>')

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2)
            continue
          }
        }

        // 处理特殊标签：在DOCTYPE声明
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          advance(doctypeMatch[0].length)
          continue
        }

        // End tag:
        // 遇到</时，会寻找对应的结束标签名并验证栈中是否有匹配的开始标签。如果有，它会从栈中移除对应的开始标签并调用options.end回调。这确保了标签的正确闭合。
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          const curIndex = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIndex, index)
          continue
        }

        // Start tag:
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
          handleStartTag(startTagMatch)
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1)
          }
          continue
        }
      }

      let text, rest, next
      if (textEnd >= 0) {
        rest = html.slice(textEnd)
        while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1)
          if (next < 0) break
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
      }

      if (textEnd < 0) {
        text = html
      }

      if (text) {
        advance(text.length)
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index)
      }
    } else {
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1)
        }
        if (options.chars) {
          options.chars(text)
        }
        return ''
      })
      index += html.length - rest.length
      html = rest
      parseEndTag(stackedTag, index - endTagLength, index)
    }

    if (html === last) {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, {
          start: index + html.length
        })
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag()

  function advance(n) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  function handleStartTag(match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName)
      }
    }

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines =
        tagName === 'a' && args[1] === 'href' ? options.shouldDecodeNewlinesForHref : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length
        attrs[i].end = args.end
      }
    }

    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs: attrs,
        start: match.start,
        end: match.end
      })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag(tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        // 如果没找到，pos会保持为-1。
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          // 找到了匹配的开始标签
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      // 表示需要清空整个栈。
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' && (i > pos || !tagName) && options.warn) {
          options.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
            start: stack[i].start,
            end: stack[i].end
          })
        }
        if (options.end) {
          // 关闭从栈顶到找到位置的所有标签
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      // br被视为自闭合标签，
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      // p需要确保闭合（因为在HTML中，p标签不允许包含块级元素，
      if (options.start) {
        // 模拟开始标签，
        options.start(tagName, [], false, start, end)
      }
      // 闭合它。这确保了即使在不正确的HTML（如p标签未显式闭合）中，p标签也能正确地闭合。
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}

/*
如何处理嵌套错误或遗漏的标签
1. 自动闭合标签
  如果浏览器在解析时发现一个新的块级元素（如<div>, <p>等）开始之前，当前的<p>标签没有闭合，它将自动闭合这个<p>标签。
  <p>这是一段文字
  <div>这是另一段文字</div>
  在这个例子中，<p>标签在<div>标签开始前自动闭合
2. 修正错误的嵌套
  HTML规范不允许将块级元素放在<p>内，如果发现这种情况，浏览器会自动修正结构，确保符合标准。
3. 忽略无效标签
  遇到无法识别的标签，它通常会忽略这些标签及其内容
4. 处理未闭合标签
  在文档结束前没有找到闭合标签，浏览器会认为这个标签直到文档的结束
5. 特殊标签的处理

HTML标准其他约束
1. <li>, <dt>, 和 <dd> 标签的父标签
<li>（列表项）标签必须位于<ul>（无序列表）、<ol>（有序列表）或<menu>（菜单列表）标签内。
<dt>（定义术语/名称）和<dd>（定义描述）标签必须位于<dl>（描述列表）标签内。
2. 表格内的特定标签
<tr>（表格行）标签必须位于<table>, <thead>, <tbody>, 或 <tfoot>标签内。
<td>（表格单元）和<th>（表格头部单元）标签必须位于<tr>标签内。
3. <thead>, <tbody>, <tfoot>, 和 <caption> 的父标签
这些标签用于构建表格的结构，必须直接位于<table>标签内。
4. <option> 和 <optgroup> 标签的父标签
<option>（选项）标签用于定义下拉列表中的选项，必须位于<select>或<optgroup>（选项组）标签内。
<optgroup>标签用于对<option>标签进行分组，必须位于<select>标签内。
5. 内联元素包含块级元素
大多数内联元素（如<span>, <a>, <b>, <em>等）不应该包含块级元素（如<div>, <p>, <h1>-<h6>等）。虽然某些浏览器可能会尝试解析并正确渲染这样的结构，但这种用法违反了HTML的规范。
6. <a> 标签嵌套
按照HTML5规范，<a>标签不应嵌套另一个<a>标签。每个<a>元素应该定义一个唯一的链接目标。
7. <header>, <footer>, 和 <main> 的使用
<header>和<footer>标签用于定义页面或页面内部区域的头部和底部。但是，它们不应该被放置在<address>, <footer>, <header> 或另一个<main>标签内部。
<main>标签用于定义文档的主要内容。一个文档中<main>标签应该是唯一的，并且不应该位于<article>, <aside>, <footer>, <header>或<nav>标签内。
*/
