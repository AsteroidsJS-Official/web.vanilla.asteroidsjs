module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'libs/**/tsconfig.lib.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import-helpers'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          '/express/',
          '/@asteroid/',
          '/socket/',
          '/math/',
          '/entity/',
          '/service/',
          '/component/',
          '/interface/',
          '/utils/',
          ['index'],
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
  },
}
