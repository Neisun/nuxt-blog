// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierConfig from 'eslint-config-prettier'

export default withNuxt(
  // Your custom configs here
  prettierConfig,
  {
    rules: {
      // Nuxt 布局天然需要 UHeader/UMain/UFooter 多根节点，关闭该规则
      'vue/no-multiple-template-root': 'off',
    },
  },
)
