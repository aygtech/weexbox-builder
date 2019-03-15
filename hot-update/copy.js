const path = require('path')
const fs = require('fs-extra')
const context = require('./context')
const AdmZip = require('adm-zip')

const config = require('../webpack/config')
const helper = require('../webpack/helper')
const weexboxConfig = require(helper.projectPath(config.weexboxConfig))

function execute(name) {
  const csContext = context.csContext()
  const android = path.join(process.cwd(), 'platforms/android/app/src/main/assets/weexbox-update')
  const ios = path.join(process.cwd(), 'platforms/ios/weexbox-update')
  const androidStaticPath = path.join(android, 'static')
  const iosStaticPath = path.join(ios, 'static')

  fs.emptyDirSync(android)
  fs.emptyDirSync(ios)
  fs.copySync(csContext.configFilePath, path.join(android, csContext.configFileName))
  fs.copySync(csContext.md5FilePath, path.join(android, csContext.md5FileName))
  fs.copySync(csContext.configFilePath, path.join(ios, csContext.configFileName))
  fs.copySync(csContext.md5FilePath, path.join(ios, csContext.md5FileName))
  if (weexboxConfig[name].imagePublicPath == 'bundle://') {
    fs.copySync(csContext.staticPath, androidStaticPath)
    fs.copySync(csContext.staticPath, iosStaticPath)
  }
  
  const zip = new AdmZip()
  zip.addLocalFolder(csContext.wwwFolderPath)
  zip.deleteFile(csContext.configFileName)
  zip.deleteFile(csContext.md5FileName)
  zip.writeZip(path.join(android, 'www.zip'))
  zip.writeZip(path.join(ios, 'www.zip'))
}

exports.execute = execute
