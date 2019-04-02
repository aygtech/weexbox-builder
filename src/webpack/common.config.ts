import WebpackBar from 'webpackbar'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import Util from '../util'
import Context from '../update/context'
import { vueLoader } from './vueLoader'

export default class CommonConfig {
  context = new Context()
  plugins = [
    new WebpackBar({
      name: 'WeexBox',
      profile: true,
    }),
    new CleanWebpackPlugin(),
  ]

  weexConfig = {
    mode: 'none',
    entry: Util.entries(),
    output: {
      path: this.context.distPath,
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.mjs', '.js', '.vue', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          enforce: 'pre',
          include: [Util.projectPath(this.context.sourceDir)],
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.vue(\?[^?]+)?$/,
          use: [
            {
              loader: 'weex-loader',
              options: vueLoader({ useVue: false }),
            },
          ],
        },
      ],
    },
    plugins: this.plugins,
    node: this.context.nodeConfiguration,
  }
}
