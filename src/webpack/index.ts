import {webpack} from 'webpack'

export default class Pack {
  constructor(name: string) {
    const webpackConfig = require(`./webpack.${name}.config`)
    webpack(webpackConfig, (err, stats) => {
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          warnings: false,
          entrypoints: false,
          assets: false,
          hash: false,
          version: false,
          timings: false,
          builtAt: false
        })
      )
      if (err == null) {
        update(name)
      }
    })
  }
}