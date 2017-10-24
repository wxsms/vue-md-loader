const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  devtool: '#cheap-module-eval-source-map',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
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
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.md$/,
        loaders: [
          'vue-loader',
          {
            loader: path.resolve(__dirname, '../index.js'),
            options: {
              plugins: [
                [
                  require('markdown-it-anchor'),
                  {
                    permalink: true,
                    permalinkSymbol: '&#128279;'
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
