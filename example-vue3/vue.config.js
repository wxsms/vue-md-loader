const path = require('path')

module.exports = {
  runtimeCompiler: true,
  chainWebpack: config => {
    config.module
      .rule('markdown')
      .test(/\.md$/)

      .use('vue-loader')
      .loader('vue-loader')
      .end()

      .use('vue-md-loader')
      .loader(path.resolve(__dirname, '../index.js'))
      .end()
  }
}
