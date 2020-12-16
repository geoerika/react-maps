module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jest',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    indent: ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single', { 'avoidEscape': true }],
    'react/display-name': 'off', // TODO: many false-positives until react eslint plugin updates
    semi: ['error', 'never'],
  },
}
