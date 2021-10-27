const path = require('path')
const anchor = require('markdown-it-anchor')

module.exports = {
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.module
      .rule('markdown')
      .test(/\.md$/)

      .use('vue-loader')
      .loader('vue-loader')
      .end()

      .use('vue-md-loader')
      .loader(path.resolve(__dirname, '../index.js'))
      .options({
        plugins: [
          [
            anchor,
            {
              permalink: anchor.permalink.headerLink(),
            },
          ],
        ],
      })
      .end()
  },
}
