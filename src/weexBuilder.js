/**
 * Created by exolution on 17/1/6.
 */
const webpack = require('webpack')
const WebpackBuilder = require('./webpackBuilder')
const vueLoaderConfig = require('../webpack/vue-loader.conf')

const defaultExt = ['we', 'vue', 'js']
const path = require('path')
const weexConfig = require('../webpack/webpack.common.config')

class WeexBuilder extends WebpackBuilder {
  constructor(source, dest, options = {}, debugConfig) {
    if (!(options.ext && typeof options.ext === 'string')) {
      options.ext = defaultExt.join('|')
    }

    super(source, dest, options)
    this.debugConfig = debugConfig
  }

  initConfig() {
    const destExt = path.extname(this.dest)
    const sourceExt = path.extname(this.sourceDef)
    let dir
    let filename

    // ./bin/weex-builder.js test dest --filename=[name].web.js
    if (this.options.filename) {
      filename = this.options.filename
    } else {
      filename = '[name].js'
    }
    // Call like: ./bin/weex-builder.js test/index.vue dest/test.js
    // Need to rename the filename of
    if (destExt && this.dest[this.dest.length - 1] !== '/' && sourceExt) {
      dir = path.dirname(this.dest)
      filename = path.basename(this.dest)
    } else {
      dir = this.dest
    }
    if (this.options.onProgress) {
      plugins.push(new webpack.ProgressPlugin(this.options.onProgress))
    }
    if (this.options.min) {
      /*
      * Plugin: UglifyJsPlugin
      * Description: Minimize all JavaScript output of chunks.
      * Loaders are switched into minimizing mode.
      *
      * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      */
      plugins.unshift(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: !!this.options.devtool
      }))
    }
    const webpackConfig = () => {
      const configs = weexConfig

      const entrys = {}
      this.source.forEach((s) => {
        let file = path.relative(path.resolve(this.base), s)
        file = file.replace(/\.\w+$/, '')
        if (!this.options.web) {
          s += '?entry=true'
        }
        entrys[file] = s
      })

      configs.entry = entrys
      configs.output = {
        path: dir,
        filename
      }
      configs.watch = this.options.watch || false
      configs.devtool = this.options.devtool || false
      configs.plugins = [
        new webpack.BannerPlugin({
          banner: '// { "framework": "Vue"} \n',
          raw: true,
          exclude: 'Vue'
        })
      ]
      configs.module.rules.push({
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static',
              publicPath: `http://${this.debugConfig.ip}:${this.debugConfig.port}/${this.debugConfig.BUNDLE_DIRECTORY}/static/`,
              name: '[name]_[hash].[ext]'
            }
          }
        ]
      })
      if (this.options.web) {
        configs.module.rules.push({
          test: /\.vue(\?[^?]+)?$/,
          use: [{
            loader: 'vue-loader',
            options: Object.assign(vueLoaderConfig({ useVue: true, usePostCSS: false }), {
              /**
               * important! should use postTransformNode to add $processStyle for
               * inline style prefixing.
               */
              optimizeSSR: false,
              compilerModules: [{
                postTransformNode: (el) => {
                  el.staticStyle = `$processStyle(${el.staticStyle})`
                  el.styleBinding = `$processStyle(${el.styleBinding})`
                }
              }]
            })
          }]
        })
      }
      return configs
    }
    this.config = webpackConfig()
  }
}
module.exports = WeexBuilder
