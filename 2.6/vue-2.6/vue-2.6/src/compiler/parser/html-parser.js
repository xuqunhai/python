/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson (MPL-1.1 OR Apache-2.0 OR GPL-2.0-or-later)
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

import { makeMap, no } from "shared/util";
import { isNonPhrasingTag } from "web/compiler/util";
import { unicodeRegExp } from "core/util/lang";

// Regular Expressions for parsing tags and attributes
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 任意数量的空白符,含除空白符、双引号、单引号、小于号、大于号、斜杠、等号外的任意字符。非捕获组，用于匹配属性名和值之间的等号，等号两边可以有任意数量的空白符。匹配属性值(双引号包裹/单引号包裹/不包含)?：整个属性值部分是可选的。
/*
html=`class="button" id='btn-id' value=123`
html.match(attribute)
["class="button"", "class", "=", "button", undefined, undefined, index: 0, input: "class="button" id='btn-id' value=123", groups: undefined]
 */
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
/*
动态参数可以是 v- 开头的指令（如 v-bind:[arg]）、@ 开头的事件（如 @[event]）、: 开头的简写绑定（如 :[arg]）、# 开头的插槽（如 #[slotName]）。
[^=]+? 匹配一到多个非 = 字符，这里的 +? 是非贪婪匹配，尽可能少地匹配
[\w-]+ 匹配一个或多个字母、数字、下划线或连字符组成的字符串，表示指令的名称。
v-bind/v-slot:[slotName]="slotProps"
*/
// 匹配几乎所有语言的字符，特别适用于需要处理国际化内容的场景
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/; // 匹配可选的自闭合斜杠 / 和闭合的大于号 >。
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

// Special Elements (can contain anything)
export const isPlainTextElement = makeMap("script,style,textarea", true);
const reCache = {};

const decodingMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&amp;": "&",
  "&#10;": "\n",
  "&#9;": "\t",
  "&#39;": "'",
};
// 将 HTML 实体编码转换回它们原始字符表示
// 防止 XSS（跨站脚本攻击）等安全问题
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

// #5992
const isIgnoreNewlineTag = makeMap("pre,textarea", true);
const shouldIgnoreFirstNewline = (tag, html) =>
  tag && isIgnoreNewlineTag(tag) && html[0] === "\n";

function decodeAttr(value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, (match) => decodingMap[match]);
}

// 先将模板字符串转换为 AST，这是因为 AST 可以更精确地表示模板的结构信息，便于后续处理。
export function parseHTML(html, options) {
  const stack = [];
  const expectHTML = options.expectHTML;
  const isUnaryTag = options.isUnaryTag || no;
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no;
  let index = 0;
  let last, lastTag;
  while (html) {
    last = html;
    // 处理标签和文本
    // Make sure we're not in a plaintext content element like script/style

    if (!lastTag || !isPlainTextElement(lastTag)) {
      // 查找下一个标签开始标记 < 的位置
      let textEnd = html.indexOf("<");
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          const commentEnd = html.indexOf("-->");

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(
                html.substring(4, commentEnd),
                index,
                index + commentEnd + 3
              );
            }
            advance(commentEnd + 3);
            continue;
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf("]>");

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue;
          }
        }

        // Doctype:
        const doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue;
        }

        // End tag:
        // 解析结束标签
        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
          const curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        }

        // Start tag:
        // 解析开始标签...
        const startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue;
        }
      }

      let text, rest, next;
      // 正确地识别出文本的结束位置
      if (textEnd >= 0) {
        // 找到了可能的文本节点的结束位置。
        rest = html.slice(textEnd);
        // 结束标签、开始标签、注释等
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // 说明在文本中出现了 <，但它不是一个标签的开始，可能只是文本内容。
          // 参数 1 确保从 rest 字符串的第二个字符开始搜索，跳过当前已知的 <。
          next = rest.indexOf("<", 1);
          if (next < 0) break; // 意味着后续没有更多可能被误解的标签开始标记
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }

      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      // 处理结束标签以及与之相关联的文本内容。
      let endTagLength = 0;
      const stackedTag = lastTag.toLowerCase();
      // 提取结束标签之前的所有文本内容和结束标签本身
      const reStackedTag =
        reCache[stackedTag] ||
        (reCache[stackedTag] = new RegExp(
          "([\\s\\S]*?)(</" + stackedTag + "[^>]*>)",
          "i"
        ));
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length; // 更新 endTagLength 为匹配到的结束标签的长度。
        // 当前标签不是纯文本元素（如 script, style, textarea）且不是 noscript
        if (!isPlainTextElement(stackedTag) && stackedTag !== "noscript") {
          // 移除文本中的 HTML 注释和 CDATA 区块。
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, "$1") // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1");
        }
        // 标签的文本内容的第一个字符是不必要的换行符.检查并移除这种换行符。
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          // 处理字符数据的回调
          options.chars(text);
        }
        return ""; // 移除了处理过的结束标签及其之前的文本内容。
      });
      index += html.length - rest.length; // 更新解析器的当前位置。
      html = rest; //  标签及其内容已被完全处理，并从原始 HTML 字符串中移除。
      // 标记结束标签的处理完成
      parseEndTag(stackedTag, index - endTagLength, index);
    }
    // 确保模板可以正常前进，避免死循环
    if (html === last) {
      options.chars && options.chars(html);
      if (
        process.env.NODE_ENV !== "production" &&
        !stack.length &&
        options.warn
      ) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, {
          start: index + html.length,
        });
      }
      break;
    }
  }

  // 处理任何未关闭的标签
  // Clean up any remaining tags
  parseEndTag();

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    //  标签名是否包含有效字符
    const start = html.match(startTagOpen); // 捕获标签的名称
    // ['<div', 'div', index: 0, input: '<div class="example" v-if="condition"></div>', groups: undefined]
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index,
      };
      advance(start[0].length); // 跳过已匹配的开始标签部分
      let end, attr;
      // 当前位置不是一个结束标签的位置，并且能匹配到一个属性
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(dynamicArgAttribute) || html.match(attribute))
      ) {
        // 记录这个属性的位置（start 和 end），并将其添加到 match.attrs 数组中。
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }
      if (end) {
        // 找到了结束标签
        match.unarySlash = end[1]; // 记录是否为自闭合标签
        advance(end[0].length); // 更新解析器的当前位置
        match.end = index; // 更新结束位置
        return match;
      }
    }
  }

  // 处理开始标签
  /*
  <p>Hello, <img src="image.jpg" /> world.</p>
  {
    tagName: "p",
    unarySlash: "", // 或不存在
    attrs: [], // 因为<p>标签没有属性
    start: ...,
    end: ...
  }
  {
    tagName: "img",
    unarySlash: "/",
    attrs: [
      ["src", "=", "image.jpg", undefined, "image.jpg", undefined]
    ],
    start: ...,
    end: ...
  }
  */
  function handleStartTag(match) {
    const tagName = match.tagName; // 提取出标签名
    const unarySlash = match.unarySlash; // 单斜杠用来标识自闭合标签。

    if (expectHTML) {
      // 如果上一个标签是 <p> 并且当前标签不属于短语标签（如块级元素）
      if (lastTag === "p" && isNonPhrasingTag(tagName)) {
        // 自动闭合 <p> 标签。
        parseEndTag(lastTag);
      }
      // 可以不显式闭合（如 <li>）并且与上一个标签相同，也自动闭合它。
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    // 是否为已知的自闭合标签（如 <img>、<br>）或是否有单斜杠。
    const unary = isUnaryTag(tagName) || !!unarySlash;

    const l = match.attrs.length;
    const attrs = new Array(l);
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i];
      const value = args[3] || args[4] || args[5] || "";
      // 解码换行符（如果需要）。
      const shouldDecodeNewlines =
        tagName === "a" && args[1] === "href"
          ? options.shouldDecodeNewlinesForHref
          : options.shouldDecodeNewlines;
      // 构造一个属性对象数组
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines),
      };
      if (process.env.NODE_ENV !== "production" && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length;
        attrs[i].end = args.end;
      }
    }

    // 如果标签不是自闭合的，将其信息压入堆栈，
    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs: attrs,
        start: match.start,
        end: match.end,
      });
      // 更新 lastTag 为当前标签名，以便后续处理闭合标签。
      lastTag = tagName;
    }

    //  start 钩子函数
    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  // 确保了结束标签正确地关闭了开始标签，并且维护了解析过程中的栈状态。
  function parseEndTag(tagName, start, end) {
    // 接收特定的标签名和位置信息
    let pos, lowerCasedTagName;
    if (start == null) start = index; // 当前解析到的位置。
    if (end == null) end = index;

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      // 在解析器维护的标签堆栈中自底向上查找首个匹配的标签
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // 处理无标签名的情况，如清空堆栈
      // If no tag name is provided, clean shop
      pos = 0; // 关闭所有打开的标签。
    }

    if (pos >= 0) {
      // 找到了匹配的开始标签或需要清空堆栈
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (
          process.env.NODE_ENV !== "production" &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          // 找到未匹配的结束标签
          options.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
            start: stack[i].start,
            end: stack[i].end,
          });
        }
        if (options.end) {
          // 被闭合的标签，回调
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      // 从堆栈中移除所有已处理的标签
      stack.length = pos;
      // 最后一个未被闭合的标签名
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === "br") {
      // 自闭合的 <br> 标签，也调用 options.start
      if (options.start) {
        // true表示它是自闭合的
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === "p") {
      // 如果未找到匹配的开始标签，并且结束标签是 <p>
      // <p> 标签可能不会显式地闭合，因为一些浏览器会自动闭合它。
      if (options.start) {
        // false标签不是自闭合
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        // 显式地闭合 <p> 标签，有助于保持内部状态的一致性和可预测性。
        options.end(tagName, start, end);
      }
    }
  }
}
