export default class CommonConfig {
  mode: 'none'
  entry: utils.getEntries()
    output: {
  path: helper.projectPath(config.distDir),
    filename: '[name].js'
},
resolve: {
  extensions: ['.mjs', '.js', '.vue', '.json']
},
module: {
  rules: [
    {
      test: /\.(js|vue)$/,
      enforce: 'pre',
      include: [helper.projectPath(config.sourceDir)],
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader'
        }
      ],
      exclude: config.excludeModuleReg
    },
    {
      test: /\.vue(\?[^?]+)?$/,
      use: [
        {
          loader: 'weex-loader',
          options: vueLoaderConfig({ useVue: false })
        }
      ],
      exclude: config.excludeModuleReg
    }
  ]
},
plugins,
  node: config.nodeConfiguration
}


// const path = require('path')
// const WebpackBar = require('webpackbar')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const config = require('./config')
// const helper = require('./helper')
// const vueLoaderConfig = require('./vue-loader.conf')
// const utils = require('./utils')

const plugins = [
  new WebpackBar({
    name: 'WeexBox',
    profile: true
  }),
  new CleanWebpackPlugin(helper.projectPath(config.delpoyDir), {
    root: path.resolve('/'),
    verbose: true
  })
]



module.exports = weexConfig
