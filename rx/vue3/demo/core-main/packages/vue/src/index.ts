// This entry is the "full-build" that includes both the runtime
// and the compiler, and supports on-the-fly compilation of the template option.
// 主要目的是实现一个完整的 Vue 3 构建版本，其中包含了运行时和编译器，支持模板选项的即时编译。

// 初始化开发环境中的特定设置和工具。
import { initDev } from './dev'
import {
  type CompilerError,
  type CompilerOptions,
  compile, // compile 函数用于将模板字符串编译成渲染函数。
} from '@vue/compiler-dom'
import {
  type RenderFunction,
  registerRuntimeCompiler, // registerRuntimeCompiler 用于注册运行时编译器
  warn, // warn 用于在开发环境中输出警告信息
} from '@vue/runtime-dom'
import * as runtimeDom from '@vue/runtime-dom'
import {
  EMPTY_OBJ,
  NOOP,
  extend,
  generateCodeFrame, // 用于生成代码框架的函数
  isString,
} from '@vue/shared'
import type { InternalRenderFunction } from 'packages/runtime-core/src/component'

if (__DEV__) {
  initDev()
}

// 缓存编译后的模板渲染函数
// 键是 CompilerOptions，值是一个记录模板字符串和渲染函数的对象。
const compileCache = new WeakMap<
  CompilerOptions,
  Record<string, RenderFunction>
>()

// 获取与指定编译选项相关的缓存对象
function getCache(options?: CompilerOptions) {
  let c = compileCache.get(options ?? EMPTY_OBJ)
  if (!c) {
    c = Object.create(null) as Record<string, RenderFunction>
    compileCache.set(options ?? EMPTY_OBJ, c)
  }
  return c
}

// 将模板字符串或 HTML 元素编译成渲染函数
function compileToFunction(
  template: string | HTMLElement,
  options?: CompilerOptions,
): RenderFunction {
  if (!isString(template)) {
    if (template.nodeType) {
      // 检查模板是否为字符串，如果不是字符串且是 HTML 元素，则提取其 innerHTML 作为模板字符串。
      template = template.innerHTML
    } else {
      __DEV__ && warn(`invalid template option: `, template)
      return NOOP
    }
  }

  // 获取或创建与编译选项相关的缓存对象。
  const key = template
  const cache = getCache(options)
  const cached = cache[key]
  if (cached) {
    // 如果缓存中存在该模板字符串对应的渲染函数，则直接返回缓存的渲染函数。
    return cached
  }

  // 如果模板字符串以 # 开头，则尝试通过 querySelector 查找对应的 DOM 元素，并提取其 innerHTML 作为模板字符串。
  if (template[0] === '#') {
    const el = document.querySelector(template)
    if (__DEV__ && !el) {
      warn(`Template element not found or is empty: ${template}`)
    }
    // __UNSAFE__
    // Reason: potential execution of JS expressions in in-DOM template.
    // The user must make sure the in-DOM template is trusted. If it's rendered
    // by the server, the template should not contain any user data.
    template = el ? el.innerHTML : ``
  }

  // 扩展编译选项，设置 hoistStatic、onError 和 onWarn 等选项。
  const opts = extend(
    {
      hoistStatic: true,
      onError: __DEV__ ? onError : undefined,
      onWarn: __DEV__ ? e => onError(e, true) : NOOP,
    } as CompilerOptions,
    options,
  )

  if (!opts.isCustomElement && typeof customElements !== 'undefined') {
    opts.isCustomElement = tag => !!customElements.get(tag)
  }

  // 编译模板字符串，生成渲染函数代码。
  const { code } = compile(template, opts)

  // 创建一个 onError 函数，用于在编译过程中处理错误。
  function onError(err: CompilerError, asWarning = false) {
    const message = asWarning
      ? err.message
      : `Template compilation error: ${err.message}`
    const codeFrame =
      err.loc &&
      generateCodeFrame(
        template as string,
        err.loc.start.offset,
        err.loc.end.offset,
      )
    warn(codeFrame ? `${message}\n${codeFrame}` : message)
  }

  // The wildcard import results in a huge object with every export
  // with keys that cannot be mangled, and can be quite heavy size-wise.
  // In the global build we know `Vue` is available globally so we can avoid
  // the wildcard object.
  // 使用 new Function 创建渲染函数，并在 __GLOBAL__ 环境中直接执行代码，否则传递 runtimeDom 作为参数执行代码。
  const render = (
    __GLOBAL__ ? new Function(code)() : new Function('Vue', code)(runtimeDom)
  ) as RenderFunction

  // mark the function as runtime compiled
  // 标记渲染函数为运行时编译。
  ;(render as InternalRenderFunction)._rc = true

  // 将渲染函数缓存起来，并返回该渲染函数。
  return (cache[key] = render)
}

registerRuntimeCompiler(compileToFunction)

export { compileToFunction as compile }
export * from '@vue/runtime-dom'
