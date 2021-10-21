const loaderUtils = require('loader-utils')
const Parser = require('./src/parser')

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable()
  }
  const options = this.getOptions()
  return new Parser(options).parse(source)
}
