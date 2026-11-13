/**
 * Prettier 配置文件
 *
 * 使用 .mjs 后缀是为了强制以 ES Module 方式解析，
 * 与项目 package.json 中的 "type": "module" 保持一致，
 * 避免不同环境下对配置文件的解析方式产生歧义。
 *
 * 所有可配置项见官方文档：https://prettier.io/docs/en/options.html
 *
 * @type {import("prettier").Config}
 */
export default {
  // 每行最大字符数，超过则自动换行（常见取值：80 / 100 / 120）
  printWidth: 100,

  // 缩进使用的空格数（有些团队喜欢用 2，追求紧凑用 2 即可）
  tabWidth: 2,

  // 是否用制表符(Tab)代替空格缩进，false 表示用空格
  useTabs: false,

  // 语句末尾是否加分号，false 表示不加（个人偏好，很多团队选 false）
  semi: false,

  // 是否使用单引号，true 表示用单引号
  singleQuote: true,

  // 对象/数组等最后一个元素后是否加逗号
  // "none" 不加；"es5" 仅 ES5 允许的地方加；"all" 尽量都加（推荐 all，方便 git diff）
  trailingComma: 'all',

  // 对象字面量的大括号内侧是否加空格，true 表示 { foo } 而不是 {foo}
  bracketSpacing: true,

  // 多行 HTML/JSX/TSX 中，> 是否另起一行，false 表示不另起
  bracketSameLine: false,

  // 箭头函数单个参数时是否加括号，'always' 总是加；'avoid' 能省则省
  arrowParens: 'always',

  // 换行符风格：'lf' (Linux/Mac) / 'crlf' (Windows) / 'auto'
  endOfLine: 'lf',

  // Vue 文件中 <script>/<style> 是否缩进，false 表示不缩进（推荐 false）
  vueIndentScriptAndStyle: false,

  // HTML 中空白字符是否保留，'css' 按 CSS 规则处理（推荐）
  htmlWhitespaceSensitivity: 'css',

  // 是否用单引号包裹 HTML/JSX 中的属性，true 表示用单引号
  singleAttributePerLine: false,
}
