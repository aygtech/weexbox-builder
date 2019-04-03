#! /usr/bin/env node

const program = require('commander')
const pack = require('../lib/webpack').default

program
  .command('develop')
  .description('开发环境编译')
  .action(() => {
    pack.build('develop')
  })

program
  .command('test')
  .description('测试环境编译')
  .action(() => {
    pack.build('test')
  })

program
  .command('preRelease')
  .description('预发布环境编译')
  .action(() => {
    pack.build('preRelease')
  })

program
  .command('release')
  .description('生产环境编译')
  .action(() => {
    pack.build('release')
  })

program.parse(process.argv)
