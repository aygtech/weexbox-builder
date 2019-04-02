import * as webpack from 'webpack'
import Md5 from '../update/md5'
import Copy from '../update/copy'
import Ready from '../update/ready'

export default class Pack {
  constructor(name: string) {
    const webpackConfig = require(`../../webpack.${name}.config`)
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
          builtAt: false,
        }),
      )
      if (err == null) {
        this.update(name)
      }
    })
  }

  update(name) {
    Md5.calculate().then(() => {
      Copy.copy(name)
      Ready.ready()
    })
  }
}
