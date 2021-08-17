module.exports = {
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  plugins: ['import-helpers'],
  extends: ['prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: ['/express/', '/socket/', '/utils/', ['index']],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
  },
}
