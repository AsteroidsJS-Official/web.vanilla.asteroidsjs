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
        groups: [
          '/fastify|inversify/',
          '/.types/',
          '/.decorator/',
          '/.guard/',
          '/.pipe/',
          '/.exception/',
          '/.entity/',
          '/.dto|.enum|.model|.input|.args/',
          '/.service/',
          '/.controller/',
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
