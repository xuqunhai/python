import {
  type CodegenResult,
  type CompilerOptions,
  type DirectiveTransform,
  type NodeTransform,
  type ParserOptions,
  type RootNode,
  baseCompile,
  baseParse,
  noopDirectiveTransform,
} from '@vue/compiler-core' // 定义编译器的核心功能
import { parserOptions } from './parserOptions'
// 导入了一系列的转换函数，这些函数在编译过程中会被调用，用于处理特定的模板指令和标签。
import { transformStyle } from './transforms/transformStyle'
import { transformVHtml } from './transforms/vHtml'
import { transformVText } from './transforms/vText'
import { transformModel } from './transforms/vModel'
import { transformOn } from './transforms/vOn'
import { transformShow } from './transforms/vShow'
import { transformTransition } from './transforms/Transition'
import { stringifyStatic } from './transforms/stringifyStatic'
import { ignoreSideEffectTags } from './transforms/ignoreSideEffectTags'
import { extend } from '@vue/shared'

export { parserOptions }

export const DOMNodeTransforms: NodeTransform[] = [
  transformStyle,
  ...(__DEV__ ? [transformTransition] : []),
]

export const DOMDirectiveTransforms: Record<string, DirectiveTransform> = {
  cloak: noopDirectiveTransform,
  html: transformVHtml,
  text: transformVText,
  model: transformModel, // override compiler-core
  on: transformOn, // override compiler-core
  show: transformShow,
}

// 编译模板字符串或根节点
export function compile(
  src: string | RootNode,
  options: CompilerOptions = {},
): CodegenResult {
  // 调用 baseCompile 函数进行基础编译。
  return baseCompile(
    src,
    extend({}, parserOptions, options, { // 选项合并。
      nodeTransforms: [ // 包括忽略副作用标签的转换函数、DOM节点转换函数和传入的节点转换函数。
        // ignore <script> and <tag>
        // this is not put inside DOMNodeTransforms because that list is used
        // by compiler-ssr to generate vnode fallback branches
        ignoreSideEffectTags,
        ...DOMNodeTransforms,
        ...(options.nodeTransforms || []),
      ],
      // 包括 DOM指令转换函数和传入的指令转换函数。
      directiveTransforms: extend(
        {},
        DOMDirectiveTransforms,
        options.directiveTransforms || {},
      ),
      // 在浏览器环境中为 null，在非浏览器环境中为 stringifyStatic 函数。
      transformHoist: __BROWSER__ ? null : stringifyStatic,
    }),
  )
}

// 解析模板字符串并生成根节点
export function parse(template: string, options: ParserOptions = {}): RootNode {
  return baseParse(template, extend({}, parserOptions, options))
}

export * from './runtimeHelpers'
export { transformStyle } from './transforms/transformStyle'
export {
  createDOMCompilerError,
  DOMErrorCodes,
  DOMErrorMessages,
} from './errors'
export * from '@vue/compiler-core'
