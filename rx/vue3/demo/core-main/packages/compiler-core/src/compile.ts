import type { CompilerOptions } from './options'
import { baseParse } from './parser'
import {
  type DirectiveTransform,
  type NodeTransform,
  transform,
} from './transform'
import { type CodegenResult, generate } from './codegen'
import type { RootNode } from './ast'
import { extend, isString } from '@vue/shared'
import { transformIf } from './transforms/vIf'
import { transformFor } from './transforms/vFor'
import { transformExpression } from './transforms/transformExpression'
import { transformSlotOutlet } from './transforms/transformSlotOutlet'
import { transformElement } from './transforms/transformElement'
import { transformOn } from './transforms/vOn'
import { transformBind } from './transforms/vBind'
import { trackSlotScopes, trackVForSlotScopes } from './transforms/vSlot'
import { transformText } from './transforms/transformText'
import { transformOnce } from './transforms/vOnce'
import { transformModel } from './transforms/vModel'
import { transformFilter } from './compat/transformFilter'
import { ErrorCodes, createCompilerError, defaultOnError } from './errors'
import { transformMemo } from './transforms/vMemo'

export type TransformPreset = [
  NodeTransform[],
  Record<string, DirectiveTransform>,
]

// 返回一个基本的转换预设
export function getBaseTransformPreset(
  prefixIdentifiers?: boolean,
): TransformPreset {
  return [
    [
      transformOnce,
      transformIf,
      transformMemo,
      transformFor,
      ...(__COMPAT__ ? [transformFilter] : []),
      ...(!__BROWSER__ && prefixIdentifiers
        ? [
            // order is important
            trackVForSlotScopes,
            transformExpression,
          ]
        : __BROWSER__ && __DEV__
          ? [transformExpression]
          : []),
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText,
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel,
    },
  ]
}

// we name it `baseCompile` so that higher order compilers like
// @vue/compiler-dom can export `compile` while re-exporting everything else.
export function baseCompile(
  source: string | RootNode,
  options: CompilerOptions = {},
): CodegenResult {
  const onError = options.onError || defaultOnError
  const isModuleMode = options.mode === 'module'
  /* istanbul ignore if */
  if (__BROWSER__) {
    if (options.prefixIdentifiers === true) {
      onError(createCompilerError(ErrorCodes.X_PREFIX_ID_NOT_SUPPORTED))
    } else if (isModuleMode) {
      onError(createCompilerError(ErrorCodes.X_MODULE_MODE_NOT_SUPPORTED))
    }
  }

  const prefixIdentifiers =
    !__BROWSER__ && (options.prefixIdentifiers === true || isModuleMode)
  if (!prefixIdentifiers && options.cacheHandlers) {
    onError(createCompilerError(ErrorCodes.X_CACHE_HANDLER_NOT_SUPPORTED))
  }
  if (options.scopeId && !isModuleMode) {
    onError(createCompilerError(ErrorCodes.X_SCOPE_ID_NOT_SUPPORTED))
  }

  // 合并选项
  const resolvedOptions = extend({}, options, {
    prefixIdentifiers,
  })
  // 如果 source 是字符串，调用 baseParse 函数解析模板字符串，生成抽象语法树（AST）；
  // 如果 source 已经是 RootNode 类型，则直接使用它。
  const ast = isString(source) ? baseParse(source, resolvedOptions) : source
  // 获取基本的节点转换和指令转换函数列表
  const [nodeTransforms, directiveTransforms] =
    getBaseTransformPreset(prefixIdentifiers)

  // 检查 options 是否启用了 TypeScript 支持
  if (!__BROWSER__ && options.isTS) {
    const { expressionPlugins } = options
    // 确保 expressionPlugins 包含 typescript 插件。
    if (!expressionPlugins || !expressionPlugins.includes('typescript')) {
      options.expressionPlugins = [...(expressionPlugins || []), 'typescript']
    }
  }

  // 对 AST 进行转换
  transform(
    ast,
    extend({}, resolvedOptions, {
      nodeTransforms: [
        ...nodeTransforms,
        ...(options.nodeTransforms || []), // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {}, // user transforms
      ),
    }),
  )

  // 根据转换后的 AST 生成代码
  return generate(ast, resolvedOptions)
}
