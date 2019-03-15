const fs = require('fs-extra')
const path = require('path')
const context = require('./context')

function execute() {
  const csContext = context.csContext()
  const config = fs.readJsonSync(csContext.configFilePath)
  const version = config.release.replace(/\./g, '')
  const wwwFolderPath = csContext.wwwFolderPath
  fs.renameSync(wwwFolderPath, path.join(wwwFolderPath, `../${version}`))
  fs.outputFileSync(csContext.versionFilePath, version)
}

exports.execute = execute