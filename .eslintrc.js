// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    jasmine: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['standard', 'plugin:jasmine/recommended'],
  // required to lint *.vue files
  plugins: ['html', 'import', 'node', 'promise', 'standard', 'jasmine'],
  // add your custom rules here
  'rules': {
    'jasmine/new-line-before-expect': 0,
    'no-unused-expressions': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
