import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import Context from '../update/context'
import CommonConfig from './common.config'
const context = new Context()
const weexboxConfig = require(context.weexboxConfigPath)

export default class DevelopConfig {
  weexConfig = {
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: weexboxConfig.develop.imagePublicPath + '/static/',
                name: '[name]_[hash].[ext]',
                outputPath: context.staticDir,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: '// { "framework": "Vue"} \n',
        raw: true,
        exclude: 'Vue',
      }),
    ],
  }
  constructor() {
    this.weexConfig = webpackMerge(this.weexConfig, new CommonConfig().weexConfig)
  }
}
