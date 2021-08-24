const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const anchor = require('markdown-it-anchor')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : undefined,
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.md$/,
        use: [
          'vue-loader',
          {
            loader: path.resolve(__dirname, '../index.js'),
            options: {
              preProcess (source) {
                // console.log('pre', source)
                return source
              },
              afterProcess (result) {
                // console.log('after', result)
                return result
              },
              afterProcessLiveTemplate (template) {
                return `<div class="live-wrapper">${template}</div>`
              },
              rules: {
                table_open: () => '<div class="table-responsive"><table class="table">',
                table_close: () => '</table></div>'
              },
              plugins: [
                [
                  anchor,
                  {
                    permalink: anchor.permalink.headerLink({
                      symbol: '&#128279;'
                    }),
                    // permalinkSymbol: '&#128279;'
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
}
