import Context from './context'
import { emptyDirSync, copySync } from 'fs-extra'
import { join } from 'path'
const AdmZip = require('adm-zip')

export default class Copy {
  static copy(configName: string) {
    const context = new Context()
    emptyDirSync(context.android)
    emptyDirSync(context.ios)
    copySync(context.configFilePath, join(context.android, context.configFileName))
    copySync(context.md5FilePath, join(context.android, context.md5FileName))
    copySync(context.configFilePath, join(context.ios, context.configFileName))
    copySync(context.md5FilePath, join(context.ios, context.md5FileName))
    const weexboxConfig = require(context.weexboxConfigPath)
    if (weexboxConfig[configName].imagePublicPath === 'bundle://') {
      copySync(context.staticPath, context.androidStaticPath)
      copySync(context.staticPath, context.iosStaticPath)
    }

    const zip = new AdmZip()
    zip.addLocalFolder(context.wwwFolderPath)
    zip.deleteFile(context.configFileName)
    zip.deleteFile(context.md5FileName)
    zip.writeZip(join(context.android, 'www.zip'))
    zip.writeZip(join(context.ios, 'www.zip'))
  }
}
