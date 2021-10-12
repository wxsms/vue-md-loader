const loaderUtils = require('loader-utils')
const Parser = require('./src/parser')

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable()
  }
  const options = loaderUtils.getOptions(this)
  return new Parser(options).parse(source)
}
