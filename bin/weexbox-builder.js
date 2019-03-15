#! /usr/bin/env node

const program = require('commander')

program
  .command('develop')
  .description('开发环境编译')
  .action(() => {
    const build = require('../webpack')
    build.execute('develop')
  })

program
  .command('test')
  .description('测试环境编译')
  .action(() => {
    const build = require('../webpack')
    build.execute('test')
  })

program
  .command('preRelease')
  .description('预发布环境编译')
  .action(() => {
    const build = require('../webpack')
    build.execute('preRelease')
  })

program
  .command('release')
  .description('生产环境编译')
  .action(() => {
    const build = require('../webpack')
    build.execute('release')
  })

program.parse(process.argv)
