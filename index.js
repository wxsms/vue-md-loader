const loaderUtils = require('loader-utils')
const Parser = require('./src/parser')

module.exports = function (source) {
  this.cacheable && this.cacheable()
  return new Parser(loaderUtils.getOptions(this)).parse(source)
}
