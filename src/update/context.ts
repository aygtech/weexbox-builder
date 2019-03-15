import { join } from 'path'
import Util from '../util'

export class Context {
  ignoreFileName = 'update-ignore.txt'
  configFileName = 'update-config.json'
  md5FileName = 'update-md5.json'
  defaultIgnoreList = ['.DS_Store', this.md5FileName, this.configFileName, '.gitignore', '.gitkeep', '.git']
  versionFileName = 'update-version.txt'
  homePath = Util.projectPath('deploy')
  wwwFolderPath = join(this.homePath, 'www')
  configPath = Util.projectPath('config')
  ignoreFilePath = join(this.configPath, this.ignoreFileName)
  defaultConfigFilePath = join(this.configPath, this.configFileName)
  configFilePath = join(this.wwwFolderPath, this.configFileName)
  md5FilePath = join(this.wwwFolderPath, this.md5FileName)
  versionFilePath = join(this.homePath, this.versionFileName)
  staticPath = join(this.homePath, 'static')
  android = Util.projectPath('platforms/android/app/src/main/assets/weexbox-update')
  ios = Util.projectPath('platforms/ios/weexbox-update')
  androidStaticPath = join(this.android, 'static')
  iosStaticPath = join(this.ios, 'static')
  weexboxConfigPath = Util.projectPath('config/weexbox-config.js')
}
