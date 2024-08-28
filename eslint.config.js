import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  stylistic.configs['recommended-flat'],

  { ignores: ['dist'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.worker,
      },
    },
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
]
