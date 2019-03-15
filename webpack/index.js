const webpack = require('webpack')

function execute(name) {
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

function update(name) {
  const md5 = require('../hot-update/md5')
  md5.execute().then(() => {
    const copy = require('../hot-update/copy')
    copy.execute(name)
    const ready = require('../hot-update/ready')
    ready.execute()
  })
}

exports.execute = execute
