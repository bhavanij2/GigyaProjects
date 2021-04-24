module.exports = {
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    "node": true,
    "browser": true,
    "es6": true
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.dev.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['off', {
      props: true,
      ignorePropertyModificationsFor: [
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 0,
    'operator-linebreak': [1, 'after'],
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': false }],
    'arrow-parens': [2, 'as-needed'],
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'semi': [1, 'always'],
    'no-unused-vars': ["error", { "vars": "local", "argsIgnorePattern": "next" }],
    'max-len': ["error", {'code': 200, 'ignoreComments': true, 'ignoreUrls': true}],
    "prefer-destructuring": ["error", {"object": true, "array": false}],
    'import/named': [false],
    'import/prefer-default-export': false,
    '@typescript-eslint/indent': ["error", 2],
    '@typescript-eslint/camelcase': {"properties": "never"},
    '@typescript-eslint/no-var-requires': false,
    '@typescript-eslint/explicit-function-return-type': false,
  }
};
