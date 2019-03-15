const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.config')
const config = require('./config')
const helper = require('./helper')
const weexboxConfig = require(helper.projectPath(config.weexboxConfig))

let weexConfig = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: weexboxConfig.preRelease.imagePublicPath + '/static/',
              name: '[name]_[hash].[ext]',
              outputPath: config.staticDir
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      parallel: true
    }),
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue"} \n',
      raw: true,
      exclude: 'Vue'
    })
  ]
}

weexConfig = merge(weexConfig, common)

module.exports = weexConfig
