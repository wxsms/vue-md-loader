// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  // required to lint *.vue files
  plugins: ['html'],

  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
  },
}
