/**
 * ESLint rules to detect and prevent cyclic (circular) dependencies.
 * Use this file by extending it in your project's ESLint config.
 *
 * Requires: eslint-plugin-import
 *   npm install --save-dev eslint-plugin-import
 *
 * Usage in .eslintrc.js or eslint.config.js:
 *   - CommonJS: ...require('./eslint-rules-cyclic-dependencies.js')
 *   - Or extend and merge this config into your existing ESLint config.
 *
 * Minimal setup: in .eslintrc (or .eslintrc.js / .eslintrc.json), you can
 * just add the rule: "import/no-cycle": "error" (with eslint-plugin-import
 * installed and the "import" plugin enabled).
 */

module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-cycle': 'error',
  },
};
