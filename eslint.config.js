import globals from "globals";
import pluginJs from "@eslint/js";

// console.log(pluginJs.configs.recommended)

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,

  { ignores: ['dist'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
