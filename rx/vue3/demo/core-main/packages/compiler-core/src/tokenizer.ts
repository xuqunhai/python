/**
 * This Tokenizer is adapted from htmlparser2 under the MIT License listed at
 * https://github.com/fb55/htmlparser2/blob/master/LICENSE

Copyright 2010, 2011, Chris Winberry <chris@winberry.net>. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
 */

import { ErrorCodes } from './errors'
import type { ElementNode, Position } from './ast'

/**
 * Note: entities is a non-browser-build-only dependency.
 * In the browser, we use an HTML element to do the decoding.
 * Make sure all imports from entities are only used in non-browser branches
 * so that it can be properly treeshaken.
 */
import {
  DecodingMode,
  EntityDecoder,
  fromCodePoint,
  htmlDecodeTree,
} from 'entities/lib/decode.js'

export enum ParseMode {
  BASE,
  HTML,
  SFC,
}

export enum CharCodes {
  Tab = 0x9, // "\t"
  NewLine = 0xa, // "\n"
  FormFeed = 0xc, // "\f"
  CarriageReturn = 0xd, // "\r"
  Space = 0x20, // " "
  ExclamationMark = 0x21, // "!"
  Number = 0x23, // "#"
  Amp = 0x26, // "&"
  SingleQuote = 0x27, // "'"
  DoubleQuote = 0x22, // '"'
  GraveAccent = 96, // "`"
  Dash = 0x2d, // "-"
  Slash = 0x2f, // "/"
  Zero = 0x30, // "0"
  Nine = 0x39, // "9"
  Semi = 0x3b, // ";"
  Lt = 0x3c, // "<"
  Eq = 0x3d, // "="
  Gt = 0x3e, // ">"
  Questionmark = 0x3f, // "?"
  UpperA = 0x41, // "A"
  LowerA = 0x61, // "a"
  UpperF = 0x46, // "F"
  LowerF = 0x66, // "f"
  UpperZ = 0x5a, // "Z"
  LowerZ = 0x7a, // "z"
  LowerX = 0x78, // "x"
  LowerV = 0x76, // "v"
  Dot = 0x2e, // "."
  Colon = 0x3a, // ":"
  At = 0x40, // "@"
  LeftSquare = 91, // "["
  RightSquare = 93, // "]"
}

const defaultDelimitersOpen = new Uint8Array([123, 123]) // "{{"
const defaultDelimitersClose = new Uint8Array([125, 125]) // "}}"

/** All the states the tokenizer can be in. */
export enum State {
  Text = 1,

  // interpolation
  InterpolationOpen,
  Interpolation,
  InterpolationClose,

  // Tags
  BeforeTagName, // After <
  InTagName,
  InSelfClosingTag,
  BeforeClosingTagName,
  InClosingTagName,
  AfterClosingTagName,

  // Attrs
  BeforeAttrName,
  InAttrName,
  InDirName,
  InDirArg,
  InDirDynamicArg,
  InDirModifier,
  AfterAttrName,
  BeforeAttrValue,
  InAttrValueDq, // "
  InAttrValueSq, // '
  InAttrValueNq,

  // Declarations
  BeforeDeclaration, // !
  InDeclaration,

  // Processing instructions
  InProcessingInstruction, // ?

  // Comments & CDATA
  BeforeComment,
  CDATASequence,
  InSpecialComment,
  InCommentLike,

  // Special tags
  BeforeSpecialS, // Decide if we deal with `<script` or `<style`
  BeforeSpecialT, // Decide if we deal with `<title` or `<textarea`
  SpecialStartSequence,
  InRCDATA,

  InEntity,

  InSFCRootTagName,
}

/**
 * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a
 * tag name.
 */
function isTagStartChar(c: number): boolean {
  return (
    (c >= CharCodes.LowerA && c <= CharCodes.LowerZ) ||
    (c >= CharCodes.UpperA && c <= CharCodes.UpperZ)
  )
}

export function isWhitespace(c: number): boolean {
  return (
    c === CharCodes.Space ||
    c === CharCodes.NewLine ||
    c === CharCodes.Tab ||
    c === CharCodes.FormFeed ||
    c === CharCodes.CarriageReturn
  )
}

function isEndOfTagSection(c: number): boolean {
  return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c)
}

export function toCharCodes(str: string): Uint8Array {
  const ret = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

export enum QuoteType {
  NoValue = 0,
  Unquoted = 1,
  Single = 2,
  Double = 3,
}

export interface Callbacks {
  ontext(start: number, endIndex: number): void
  ontextentity(char: string, start: number, endIndex: number): void

  oninterpolation(start: number, endIndex: number): void

  onopentagname(start: number, endIndex: number): void
  onopentagend(endIndex: number): void
  onselfclosingtag(endIndex: number): void
  onclosetag(start: number, endIndex: number): void

  onattribdata(start: number, endIndex: number): void
  onattribentity(char: string, start: number, end: number): void
  onattribend(quote: QuoteType, endIndex: number): void
  onattribname(start: number, endIndex: number): void
  onattribnameend(endIndex: number): void

  ondirname(start: number, endIndex: number): void
  ondirarg(start: number, endIndex: number): void
  ondirmodifier(start: number, endIndex: number): void

  oncomment(start: number, endIndex: number): void
  oncdata(start: number, endIndex: number): void

  onprocessinginstruction(start: number, endIndex: number): void
  // ondeclaration(start: number, endIndex: number): void
  onend(): void
  onerr(code: ErrorCodes, index: number): void
}

/**
 * Sequences used to match longer strings.
 *
 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
 * sequences with an increased offset.
 */
export const Sequences = {
  Cdata: new Uint8Array([0x43, 0x44, 0x41, 0x54, 0x41, 0x5b]), // CDATA[
  CdataEnd: new Uint8Array([0x5d, 0x5d, 0x3e]), // ]]>
  CommentEnd: new Uint8Array([0x2d, 0x2d, 0x3e]), // `-->`
  ScriptEnd: new Uint8Array([0x3c, 0x2f, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74]), // `</script`
  StyleEnd: new Uint8Array([0x3c, 0x2f, 0x73, 0x74, 0x79, 0x6c, 0x65]), // `</style`
  TitleEnd: new Uint8Array([0x3c, 0x2f, 0x74, 0x69, 0x74, 0x6c, 0x65]), // `</title`
  TextareaEnd: new Uint8Array([
    0x3c, 0x2f, 116, 101, 120, 116, 97, 114, 101, 97,
  ]), // `</textarea
}

export default class Tokenizer {
  /** The current state the tokenizer is in. */
  public state = State.Text
  /** The read buffer. */
  private buffer = ''
  /** The beginning of the section that is currently being read. */
  public sectionStart = 0
  /** The index within the buffer that we are currently looking at. */
  private index = 0
  /** The start of the last entity. */
  private entityStart = 0
  /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
  private baseState = State.Text
  /** For special parsing behavior inside of script and style tags. */
  public inRCDATA = false
  /** For disabling RCDATA tags handling */
  public inXML = false
  /** For disabling interpolation parsing in v-pre */
  public inVPre = false
  /** Record newline positions for fast line / column calculation */
  private newlines: number[] = []

  private readonly entityDecoder?: EntityDecoder

  public mode = ParseMode.BASE
  public get inSFCRoot() {
    return this.mode === ParseMode.SFC && this.stack.length === 0
  }

  constructor(
    private readonly stack: ElementNode[],
    private readonly cbs: Callbacks,
  ) {
    if (!__BROWSER__) {
      this.entityDecoder = new EntityDecoder(htmlDecodeTree, (cp, consumed) =>
        this.emitCodePoint(cp, consumed),
      )
    }
  }

  public reset(): void {
    this.state = State.Text
    this.mode = ParseMode.BASE
    this.buffer = ''
    this.sectionStart = 0
    this.index = 0
    this.baseState = State.Text
    this.inRCDATA = false
    this.currentSequence = undefined!
    this.newlines.length = 0
    this.delimiterOpen = defaultDelimitersOpen
    this.delimiterClose = defaultDelimitersClose
  }

  /**
   * Generate Position object with line / column information using recorded
   * newline positions. We know the index is always going to be an already
   * processed index, so all the newlines up to this index should have been
   * recorded.
   */
  public getPos(index: number): Position {
    let line = 1
    let column = index + 1
    for (let i = this.newlines.length - 1; i >= 0; i--) {
      const newlineIndex = this.newlines[i]
      if (index > newlineIndex) {
        line = i + 2
        column = index - newlineIndex
        break
      }
    }
    return {
      column,
      line,
      offset: index,
    }
  }

  private peek() {
    return this.buffer.charCodeAt(this.index + 1)
  }

  // 私有方法
  /*
  总结
stateText 方法处理纯文本状态下的字符，根据不同的字符类型进行相应的状态转换和处理：
处理 < 符号：
将文本片段传递给回调函数 ontext。
更新状态为 State.BeforeTagName，准备解析标签名。

处理 & 符号（非浏览器环境）：
进入实体字符处理状态，调用 startEntity 方法。

处理插值表达式的起始定界符：
进入插值表达式起始定界符解析状态，调用 stateInterpolationOpen 方法。
  */
  private stateText(c: number): void {
    // CharCodes.Lt 是 < 的 Unicode 编码。
    if (c === CharCodes.Lt) {
      if (this.index > this.sectionStart) {
        // 表示已经解析了一段文本内容
        // 传递当前文本片段的起始和结束索引。
        this.cbs.ontext(this.sectionStart, this.index)
      }
      this.state = State.BeforeTagName // 表示即将进入标签名解析状态。
      this.sectionStart = this.index // 准备解析后续内容。
    } else if (!__BROWSER__ && c === CharCodes.Amp) {
      // 处理 & 符号（仅限非浏览器环境）
      this.startEntity()
    } else if (!this.inVPre && c === this.delimiterOpen[0]) { // 仅在 v-pre 指令未启用的情况下处理插值表达式。检查当前字符是否是插值表达式的起始定界符（默认为 {{ 的第一个字符）。
      // 处理插值表达式的起始定界符
      this.state = State.InterpolationOpen // 表示即将进入插值表达式起始定界符解析状态。
      this.delimiterIndex = 0 // 表示当前解析的是第一个定界符字符。
      this.stateInterpolationOpen(c) // 处理插值表达式起始定界符。
    }
  }

  public delimiterOpen: Uint8Array = defaultDelimitersOpen
  public delimiterClose: Uint8Array = defaultDelimitersClose
  private delimiterIndex = -1

  // 私有方法，用于处理插值表达式起始定界符的状态。
  private stateInterpolationOpen(c: number): void {
    // 检查当前字符是否与插值表达式的起始定界符（默认为 {{）中的当前字符匹配。
    if (c === this.delimiterOpen[this.delimiterIndex]) {
      if (this.delimiterIndex === this.delimiterOpen.length - 1) {
        const start = this.index + 1 - this.delimiterOpen.length
        if (start > this.sectionStart) {
          this.cbs.ontext(this.sectionStart, start)
        }
        this.state = State.Interpolation
        this.sectionStart = start
      } else {
        this.delimiterIndex++
      }
    } else if (this.inRCDATA) {
      this.state = State.InRCDATA
      this.stateInRCDATA(c)
    } else {
      this.state = State.Text
      this.stateText(c)
    }
  }

  private stateInterpolation(c: number): void {
    if (c === this.delimiterClose[0]) {
      this.state = State.InterpolationClose
      this.delimiterIndex = 0
      this.stateInterpolationClose(c)
    }
  }

  private stateInterpolationClose(c: number) {
    if (c === this.delimiterClose[this.delimiterIndex]) {
      if (this.delimiterIndex === this.delimiterClose.length - 1) {
        this.cbs.oninterpolation(this.sectionStart, this.index + 1)
        if (this.inRCDATA) {
          this.state = State.InRCDATA
        } else {
          this.state = State.Text
        }
        this.sectionStart = this.index + 1
      } else {
        this.delimiterIndex++
      }
    } else {
      this.state = State.Interpolation
      this.stateInterpolation(c)
    }
  }

  public currentSequence: Uint8Array = undefined!
  private sequenceIndex = 0
  private stateSpecialStartSequence(c: number): void {
    const isEnd = this.sequenceIndex === this.currentSequence.length
    const isMatch = isEnd
      ? // If we are at the end of the sequence, make sure the tag name has ended
        isEndOfTagSection(c)
      : // Otherwise, do a case-insensitive comparison
        (c | 0x20) === this.currentSequence[this.sequenceIndex]

    if (!isMatch) {
      this.inRCDATA = false
    } else if (!isEnd) {
      this.sequenceIndex++
      return
    }

    this.sequenceIndex = 0
    this.state = State.InTagName
    this.stateInTagName(c)
  }

  /** Look for an end tag. For <title> and <textarea>, also decode entities. */
  private stateInRCDATA(c: number): void {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes.Gt || isWhitespace(c)) {
        const endOfText = this.index - this.currentSequence.length

        if (this.sectionStart < endOfText) {
          // Spoof the index so that reported locations match up.
          const actualIndex = this.index
          this.index = endOfText
          this.cbs.ontext(this.sectionStart, endOfText)
          this.index = actualIndex
        }

        this.sectionStart = endOfText + 2 // Skip over the `</`
        this.stateInClosingTagName(c)
        this.inRCDATA = false
        return // We are done; skip the rest of the function.
      }

      this.sequenceIndex = 0
    }

    if ((c | 0x20) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1
    } else if (this.sequenceIndex === 0) {
      if (
        this.currentSequence === Sequences.TitleEnd ||
        (this.currentSequence === Sequences.TextareaEnd && !this.inSFCRoot)
      ) {
        // We have to parse entities in <title> and <textarea> tags.
        if (!__BROWSER__ && c === CharCodes.Amp) {
          this.startEntity()
        } else if (c === this.delimiterOpen[0]) {
          // We also need to handle interpolation
          this.state = State.InterpolationOpen
          this.delimiterIndex = 0
          this.stateInterpolationOpen(c)
        }
      } else if (this.fastForwardTo(CharCodes.Lt)) {
        // Outside of <title> and <textarea> tags, we can fast-forward.
        this.sequenceIndex = 1
      }
    } else {
      // If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
      this.sequenceIndex = Number(c === CharCodes.Lt)
    }
  }

  private stateCDATASequence(c: number): void {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike
        this.currentSequence = Sequences.CdataEnd
        this.sequenceIndex = 0
        this.sectionStart = this.index + 1
      }
    } else {
      this.sequenceIndex = 0
      this.state = State.InDeclaration
      this.stateInDeclaration(c) // Reconsume the character
    }
  }

  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  private fastForwardTo(c: number): boolean {
    while (++this.index < this.buffer.length) {
      const cc = this.buffer.charCodeAt(this.index)
      if (cc === CharCodes.NewLine) {
        this.newlines.push(this.index)
      }
      if (cc === c) {
        return true
      }
    }

    /*
     * We increment the index at the end of the `parse` loop,
     * so set it to `buffer.length - 1` here.
     *
     * TODO: Refactor `parse` to increment index before calling states.
     */
    this.index = this.buffer.length - 1

    return false
  }

  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  private stateInCommentLike(c: number): void {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index - 2)
        } else {
          this.cbs.oncomment(this.sectionStart, this.index - 2)
        }

        this.sequenceIndex = 0
        this.sectionStart = this.index + 1
        this.state = State.Text
      }
    } else if (this.sequenceIndex === 0) {
      // Fast-forward to the first character of the sequence
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      // Allow long sequences, eg. --->, ]]]>
      this.sequenceIndex = 0
    }
  }

  private startSpecial(sequence: Uint8Array, offset: number) {
    this.enterRCDATA(sequence, offset)
    this.state = State.SpecialStartSequence
  }

  public enterRCDATA(sequence: Uint8Array, offset: number) {
    this.inRCDATA = true
    this.currentSequence = sequence
    this.sequenceIndex = offset
  }

  private stateBeforeTagName(c: number): void {
    if (c === CharCodes.ExclamationMark) {
      this.state = State.BeforeDeclaration
      this.sectionStart = this.index + 1
    } else if (c === CharCodes.Questionmark) {
      this.state = State.InProcessingInstruction
      this.sectionStart = this.index + 1
    } else if (isTagStartChar(c)) {
      this.sectionStart = this.index
      if (this.mode === ParseMode.BASE) {
        // no special tags in base mode
        this.state = State.InTagName
      } else if (this.inSFCRoot) {
        // SFC mode + root level
        // - everything except <template> is RAWTEXT
        // - <template> with lang other than html is also RAWTEXT
        this.state = State.InSFCRootTagName
      } else if (!this.inXML) {
        // HTML mode
        // - <script>, <style> RAWTEXT
        // - <title>, <textarea> RCDATA
        if (c === 116 /* t */) {
          this.state = State.BeforeSpecialT
        } else {
          this.state =
            c === 115 /* s */ ? State.BeforeSpecialS : State.InTagName
        }
      } else {
        this.state = State.InTagName
      }
    } else if (c === CharCodes.Slash) {
      this.state = State.BeforeClosingTagName
    } else {
      this.state = State.Text
      this.stateText(c)
    }
  }
  private stateInTagName(c: number): void {
    if (isEndOfTagSection(c)) {
      this.handleTagName(c)
    }
  }
  private stateInSFCRootTagName(c: number): void {
    if (isEndOfTagSection(c)) {
      const tag = this.buffer.slice(this.sectionStart, this.index)
      if (tag !== 'template') {
        this.enterRCDATA(toCharCodes(`</` + tag), 0)
      }
      this.handleTagName(c)
    }
  }
  private handleTagName(c: number) {
    this.cbs.onopentagname(this.sectionStart, this.index)
    this.sectionStart = -1
    this.state = State.BeforeAttrName
    this.stateBeforeAttrName(c)
  }
  private stateBeforeClosingTagName(c: number): void {
    if (isWhitespace(c)) {
      // Ignore
    } else if (c === CharCodes.Gt) {
      if (__DEV__ || !__BROWSER__) {
        this.cbs.onerr(ErrorCodes.MISSING_END_TAG_NAME, this.index)
      }
      this.state = State.Text
      // Ignore
      this.sectionStart = this.index + 1
    } else {
      this.state = isTagStartChar(c)
        ? State.InClosingTagName
        : State.InSpecialComment
      this.sectionStart = this.index
    }
  }
  private stateInClosingTagName(c: number): void {
    if (c === CharCodes.Gt || isWhitespace(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index)
      this.sectionStart = -1
      this.state = State.AfterClosingTagName
      this.stateAfterClosingTagName(c)
    }
  }
  private stateAfterClosingTagName(c: number): void {
    // Skip everything until ">"
    if (c === CharCodes.Gt) {
      this.state = State.Text
      this.sectionStart = this.index + 1
    }
  }
  private stateBeforeAttrName(c: number): void {
    if (c === CharCodes.Gt) {
      this.cbs.onopentagend(this.index)
      if (this.inRCDATA) {
        this.state = State.InRCDATA
      } else {
        this.state = State.Text
      }
      this.sectionStart = this.index + 1
    } else if (c === CharCodes.Slash) {
      this.state = State.InSelfClosingTag
      if ((__DEV__ || !__BROWSER__) && this.peek() !== CharCodes.Gt) {
        this.cbs.onerr(ErrorCodes.UNEXPECTED_SOLIDUS_IN_TAG, this.index)
      }
    } else if (c === CharCodes.Lt && this.peek() === CharCodes.Slash) {
      // special handling for </ appearing in open tag state
      // this is different from standard HTML parsing but makes practical sense
      // especially for parsing intermediate input state in IDEs.
      this.cbs.onopentagend(this.index)
      this.state = State.BeforeTagName
      this.sectionStart = this.index
    } else if (!isWhitespace(c)) {
      if ((__DEV__ || !__BROWSER__) && c === CharCodes.Eq) {
        this.cbs.onerr(
          ErrorCodes.UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME,
          this.index,
        )
      }
      this.handleAttrStart(c)
    }
  }
  private handleAttrStart(c: number) {
    if (c === CharCodes.LowerV && this.peek() === CharCodes.Dash) {
      this.state = State.InDirName
      this.sectionStart = this.index
    } else if (
      c === CharCodes.Dot ||
      c === CharCodes.Colon ||
      c === CharCodes.At ||
      c === CharCodes.Number
    ) {
      this.cbs.ondirname(this.index, this.index + 1)
      this.state = State.InDirArg
      this.sectionStart = this.index + 1
    } else {
      this.state = State.InAttrName
      this.sectionStart = this.index
    }
  }
  private stateInSelfClosingTag(c: number): void {
    if (c === CharCodes.Gt) {
      this.cbs.onselfclosingtag(this.index)
      this.state = State.Text
      this.sectionStart = this.index + 1
      this.inRCDATA = false // Reset special state, in case of self-closing special tags
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttrName
      this.stateBeforeAttrName(c)
    }
  }
  private stateInAttrName(c: number): void {
    if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index)
      this.handleAttrNameEnd(c)
    } else if (
      (__DEV__ || !__BROWSER__) &&
      (c === CharCodes.DoubleQuote ||
        c === CharCodes.SingleQuote ||
        c === CharCodes.Lt)
    ) {
      this.cbs.onerr(
        ErrorCodes.UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME,
        this.index,
      )
    }
  }
  private stateInDirName(c: number): void {
    if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.ondirname(this.sectionStart, this.index)
      this.handleAttrNameEnd(c)
    } else if (c === CharCodes.Colon) {
      this.cbs.ondirname(this.sectionStart, this.index)
      this.state = State.InDirArg
      this.sectionStart = this.index + 1
    } else if (c === CharCodes.Dot) {
      this.cbs.ondirname(this.sectionStart, this.index)
      this.state = State.InDirModifier
      this.sectionStart = this.index + 1
    }
  }
  private stateInDirArg(c: number): void {
    if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.ondirarg(this.sectionStart, this.index)
      this.handleAttrNameEnd(c)
    } else if (c === CharCodes.LeftSquare) {
      this.state = State.InDirDynamicArg
    } else if (c === CharCodes.Dot) {
      this.cbs.ondirarg(this.sectionStart, this.index)
      this.state = State.InDirModifier
      this.sectionStart = this.index + 1
    }
  }
  private stateInDynamicDirArg(c: number): void {
    if (c === CharCodes.RightSquare) {
      this.state = State.InDirArg
    } else if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.ondirarg(this.sectionStart, this.index + 1)
      this.handleAttrNameEnd(c)
      if (__DEV__ || !__BROWSER__) {
        this.cbs.onerr(
          ErrorCodes.X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END,
          this.index,
        )
      }
    }
  }
  private stateInDirModifier(c: number): void {
    if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.ondirmodifier(this.sectionStart, this.index)
      this.handleAttrNameEnd(c)
    } else if (c === CharCodes.Dot) {
      this.cbs.ondirmodifier(this.sectionStart, this.index)
      this.sectionStart = this.index + 1
    }
  }
  private handleAttrNameEnd(c: number): void {
    this.sectionStart = this.index
    this.state = State.AfterAttrName
    this.cbs.onattribnameend(this.index)
    this.stateAfterAttrName(c)
  }
  private stateAfterAttrName(c: number): void {
    if (c === CharCodes.Eq) {
      this.state = State.BeforeAttrValue
    } else if (c === CharCodes.Slash || c === CharCodes.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart)
      this.sectionStart = -1
      this.state = State.BeforeAttrName
      this.stateBeforeAttrName(c)
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart)
      this.handleAttrStart(c)
    }
  }
  private stateBeforeAttrValue(c: number): void {
    if (c === CharCodes.DoubleQuote) {
      this.state = State.InAttrValueDq
      this.sectionStart = this.index + 1
    } else if (c === CharCodes.SingleQuote) {
      this.state = State.InAttrValueSq
      this.sectionStart = this.index + 1
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index
      this.state = State.InAttrValueNq
      this.stateInAttrValueNoQuotes(c) // Reconsume token
    }
  }
  private handleInAttrValue(c: number, quote: number) {
    if (c === quote || (__BROWSER__ && this.fastForwardTo(quote))) {
      this.cbs.onattribdata(this.sectionStart, this.index)
      this.sectionStart = -1
      this.cbs.onattribend(
        quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single,
        this.index + 1,
      )
      this.state = State.BeforeAttrName
    } else if (!__BROWSER__ && c === CharCodes.Amp) {
      this.startEntity()
    }
  }
  private stateInAttrValueDoubleQuotes(c: number): void {
    this.handleInAttrValue(c, CharCodes.DoubleQuote)
  }
  private stateInAttrValueSingleQuotes(c: number): void {
    this.handleInAttrValue(c, CharCodes.SingleQuote)
  }
  private stateInAttrValueNoQuotes(c: number): void {
    if (isWhitespace(c) || c === CharCodes.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index)
      this.sectionStart = -1
      this.cbs.onattribend(QuoteType.Unquoted, this.index)
      this.state = State.BeforeAttrName
      this.stateBeforeAttrName(c)
    } else if (
      ((__DEV__ || !__BROWSER__) && c === CharCodes.DoubleQuote) ||
      c === CharCodes.SingleQuote ||
      c === CharCodes.Lt ||
      c === CharCodes.Eq ||
      c === CharCodes.GraveAccent
    ) {
      this.cbs.onerr(
        ErrorCodes.UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE,
        this.index,
      )
    } else if (!__BROWSER__ && c === CharCodes.Amp) {
      this.startEntity()
    }
  }
  private stateBeforeDeclaration(c: number): void {
    if (c === CharCodes.LeftSquare) {
      this.state = State.CDATASequence
      this.sequenceIndex = 0
    } else {
      this.state =
        c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration
    }
  }
  private stateInDeclaration(c: number): void {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      // this.cbs.ondeclaration(this.sectionStart, this.index)
      this.state = State.Text
      this.sectionStart = this.index + 1
    }
  }
  private stateInProcessingInstruction(c: number): void {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index)
      this.state = State.Text
      this.sectionStart = this.index + 1
    }
  }
  private stateBeforeComment(c: number): void {
    if (c === CharCodes.Dash) {
      this.state = State.InCommentLike
      this.currentSequence = Sequences.CommentEnd
      // Allow short comments (eg. <!-->)
      this.sequenceIndex = 2
      this.sectionStart = this.index + 1
    } else {
      this.state = State.InDeclaration
    }
  }
  private stateInSpecialComment(c: number): void {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index)
      this.state = State.Text
      this.sectionStart = this.index + 1
    }
  }
  private stateBeforeSpecialS(c: number): void {
    if (c === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4)
    } else if (c === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4)
    } else {
      this.state = State.InTagName
      this.stateInTagName(c) // Consume the token again
    }
  }
  private stateBeforeSpecialT(c: number): void {
    if (c === Sequences.TitleEnd[3]) {
      this.startSpecial(Sequences.TitleEnd, 4)
    } else if (c === Sequences.TextareaEnd[3]) {
      this.startSpecial(Sequences.TextareaEnd, 4)
    } else {
      this.state = State.InTagName
      this.stateInTagName(c) // Consume the token again
    }
  }

  private startEntity() {
    if (!__BROWSER__) {
      this.baseState = this.state
      this.state = State.InEntity
      this.entityStart = this.index
      this.entityDecoder!.startEntity(
        this.baseState === State.Text || this.baseState === State.InRCDATA
          ? DecodingMode.Legacy
          : DecodingMode.Attribute,
      )
    }
  }

  private stateInEntity(): void {
    if (!__BROWSER__) {
      const length = this.entityDecoder!.write(this.buffer, this.index)

      // If `length` is positive, we are done with the entity.
      if (length >= 0) {
        this.state = this.baseState

        if (length === 0) {
          this.index = this.entityStart
        }
      } else {
        // Mark buffer as consumed.
        this.index = this.buffer.length - 1
      }
    }
  }

  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  public parse(input: string) {
    // 赋值给实例属性 buffer，用于后续的字符读取。
    this.buffer = input
    // 循环处理每个字符，直到 index 达到 buffer 的长度。
    while (this.index < this.buffer.length) {
      // 获取当前索引处字符的 Unicode 编码，并存储在 c 变量中。
      const c = this.buffer.charCodeAt(this.index)
      // 换行符
      if (c === CharCodes.NewLine) {
        this.newlines.push(this.index)
      }
      // 根据当前状态处理字符
      switch (this.state) {
        case State.Text: {
          // 处理纯文本内容，识别文本的开始和结束位置，将其作为文本节点添加到解析树中。
          this.stateText(c)
          break
        }
        case State.InterpolationOpen: {
          // 识别 {{ 标记，进入插值表达式解析状态。
          this.stateInterpolationOpen(c)
          break
        }
        case State.Interpolation: {
          // 解析插值表达式的内容，直到遇到 }} 结束标记。
          this.stateInterpolation(c)
          break
        }
        case State.InterpolationClose: {
          // 识别 }} 标记，完成插值表达式的解析，返回文本解析状态。
          this.stateInterpolationClose(c)
          break
        }
        case State.SpecialStartSequence: {
          // 识别 <! 开始的特殊字符序列，进入相应的解析状态（如注释、CDATA等）。
          this.stateSpecialStartSequence(c)
          break
        }
        case State.InRCDATA: {
          // 解析 RCDATA 内容，直到遇到结束标签。
          this.stateInRCDATA(c)
          break
        }
        case State.CDATASequence: {
          // 识别 <![CDATA[ 标记，进入CDATA内容解析状态。
          this.stateCDATASequence(c)
          break
        }
        case State.InAttrValueDq: {
          // 解析被双引号包裹的属性值，直到遇到结束的双引号。
          this.stateInAttrValueDoubleQuotes(c)
          break
        }
        case State.InAttrName: {
          // 识别属性名的开始和结束，将其作为属性名节点添加到解析树中。
          this.stateInAttrName(c)
          break
        }
        case State.InDirName: {
          // 识别指令名，将其作为指令节点添加到解析树中。
          this.stateInDirName(c)
          break
        }
        case State.InDirArg: {
          // 识别指令参数，将其添加到指令节点中。
          this.stateInDirArg(c)
          break
        }
        case State.InDirDynamicArg: {
          // 识别动态指令参数，将其添加到指令节点中。
          this.stateInDynamicDirArg(c)
          break
        }
        case State.InDirModifier: {
          // 识别指令修饰符，将其添加到指令节点中。
          this.stateInDirModifier(c)
          break
        }
        case State.InCommentLike: {
          // 识别注释内容，直到遇到 --> 结束标记。
          this.stateInCommentLike(c)
          break
        }
        case State.InSpecialComment: {
          // 识别特殊注释内容，直到遇到相应的结束标记。
          this.stateInSpecialComment(c)
          break
        }
        case State.BeforeAttrName: {
          // 识别属性名前的空白和符号，进入属性名解析状态。
          this.stateBeforeAttrName(c)
          break
        }
        case State.InTagName: {
          // 识别标签名，将其作为标签节点添加到解析树中。
          this.stateInTagName(c)
          break
        }
        case State.InSFCRootTagName: {
          // 识别 SFC 根标签名，进入标签解析状态。
          this.stateInSFCRootTagName(c)
          break
        }
        case State.InClosingTagName: {
          // 识别关闭标签名，进入关闭标签解析状态。
          this.stateInClosingTagName(c)
          break
        }
        case State.BeforeTagName: {
          // 识别标签名前的空白和符号，进入标签名解析状态。
          this.stateBeforeTagName(c)
          break
        }
        case State.AfterAttrName: {
          // 识别属性名后的空白和符号，进入属性值解析状态。
          this.stateAfterAttrName(c)
          break
        }
        case State.InAttrValueSq: {
          // 解析被单引号包裹的属性值，直到遇到结束的单引号。
          this.stateInAttrValueSingleQuotes(c)
          break
        }
        case State.BeforeAttrValue: {
          // 识别属性值前的空白和符号，进入属性值解析状态。
          this.stateBeforeAttrValue(c)
          break
        }
        case State.BeforeClosingTagName: {
          // 识别关闭标签名前的空白和符号，进入关闭标签名解析状态。
          this.stateBeforeClosingTagName(c)
          break
        }
        case State.AfterClosingTagName: {
          // 识别关闭标签名后的空白和符号，进入标签解析结束状态。
          this.stateAfterClosingTagName(c)
          break
        }
        case State.BeforeSpecialS: {
          // 识别 S 开头的特殊标签，进入特殊标签解析状态。
          this.stateBeforeSpecialS(c)
          break
        }
        case State.BeforeSpecialT: {
          // 识别 T 开头的特殊标签，进入特殊标签解析状态。
          this.stateBeforeSpecialT(c)
          break
        }
        case State.InAttrValueNq: {
          // 解析未被引号包裹的属性值，直到遇到空白或符号结束。
          this.stateInAttrValueNoQuotes(c)
          break
        }
        case State.InSelfClosingTag: {
          // 识别自闭合标签，处理自闭合逻辑并返回解析树。
          this.stateInSelfClosingTag(c)
          break
        }
        case State.InDeclaration: {
          // 识别声明内容并解析。
          this.stateInDeclaration(c)
          break
        }
        case State.BeforeDeclaration: {
          // 识别声明前的符号和空白，进入声明解析状态。
          this.stateBeforeDeclaration(c)
          break
        }
        case State.BeforeComment: {
          // 识别注释前的符号和空白，进入注释解析状态。
          this.stateBeforeComment(c)
          break
        }
        case State.InProcessingInstruction: {
          // 识别处理指令并解析内容。
          this.stateInProcessingInstruction(c)
          break
        }
        case State.InEntity: {
          // 识别 HTML 实体并解析成相应的字符。
          this.stateInEntity()
          break
        }
      }
      // 每处理一个字符，递增索引 index，继续处理下一个字符。
      this.index++
    }
    // 当所有字符处理完毕后，调用 cleanup 函数进行清理工作。
    this.cleanup()
    this.finish()
  }

  /**
   * Remove data that has already been consumed from the buffer.
   */
  private cleanup() {
    // If we are inside of text or attributes, emit what we already have.
    if (this.sectionStart !== this.index) {
      if (
        this.state === State.Text ||
        (this.state === State.InRCDATA && this.sequenceIndex === 0)
      ) {
        this.cbs.ontext(this.sectionStart, this.index)
        this.sectionStart = this.index
      } else if (
        this.state === State.InAttrValueDq ||
        this.state === State.InAttrValueSq ||
        this.state === State.InAttrValueNq
      ) {
        this.cbs.onattribdata(this.sectionStart, this.index)
        this.sectionStart = this.index
      }
    }
  }

  private finish() {
    if (!__BROWSER__ && this.state === State.InEntity) {
      this.entityDecoder!.end()
      this.state = this.baseState
    }

    this.handleTrailingData()

    this.cbs.onend()
  }

  /** Handle any trailing data. */
  private handleTrailingData() {
    const endIndex = this.buffer.length

    // If there is no remaining data, we are done.
    if (this.sectionStart >= endIndex) {
      return
    }

    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex)
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex)
      }
    } else if (
      this.state === State.InTagName ||
      this.state === State.BeforeAttrName ||
      this.state === State.BeforeAttrValue ||
      this.state === State.AfterAttrName ||
      this.state === State.InAttrName ||
      this.state === State.InDirName ||
      this.state === State.InDirArg ||
      this.state === State.InDirDynamicArg ||
      this.state === State.InDirModifier ||
      this.state === State.InAttrValueSq ||
      this.state === State.InAttrValueDq ||
      this.state === State.InAttrValueNq ||
      this.state === State.InClosingTagName
    ) {
      /*
       * If we are currently in an opening or closing tag, us not calling the
       * respective callback signals that the tag should be ignored.
       */
    } else {
      this.cbs.ontext(this.sectionStart, endIndex)
    }
  }

  private emitCodePoint(cp: number, consumed: number): void {
    if (!__BROWSER__) {
      if (this.baseState !== State.Text && this.baseState !== State.InRCDATA) {
        if (this.sectionStart < this.entityStart) {
          this.cbs.onattribdata(this.sectionStart, this.entityStart)
        }
        this.sectionStart = this.entityStart + consumed
        this.index = this.sectionStart - 1

        this.cbs.onattribentity(
          fromCodePoint(cp),
          this.entityStart,
          this.sectionStart,
        )
      } else {
        if (this.sectionStart < this.entityStart) {
          this.cbs.ontext(this.sectionStart, this.entityStart)
        }
        this.sectionStart = this.entityStart + consumed
        this.index = this.sectionStart - 1

        this.cbs.ontextentity(
          fromCodePoint(cp),
          this.entityStart,
          this.sectionStart,
        )
      }
    }
  }
}
