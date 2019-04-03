import { join } from 'path'
import Util from '../util'

export default class Context {
  nodeConfiguration = {
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
    clearImmediate: false,
    // see: https://github.com/webpack/node-libs-browser
    assert: false,
    buffer: false,
    child_process: false,
    cluster: false,
    console: false,
    constants: false,
    crypto: false,
    dgram: false,
    dns: false,
    domain: false,
    events: false,
    fs: false,
    http: false,
    https: false,
    module: false,
    net: false,
    os: false,
    path: false,
    process: false,
    punycode: false,
    querystring: false,
    readline: false,
    repl: false,
    stream: false,
    string_decoder: false,
    sys: false,
    timers: false,
    tls: false,
    tty: false,
    url: false,
    util: false,
    vm: false,
    zlib: false,
  }
  sourceDir = 'src'
  distDir = 'dist'
  wwwDic = 'www'
  staticDir = 'static'
  configFileName = 'update-config.json'
  md5FileName = 'update-md5.json'
  versionFileName = 'update-version.txt'
  distPath = Util.projectPath(this.distDir)
  wwwFolderPath = join(this.distPath, this.wwwDic)
  configPath = Util.projectPath('config')
  defaultConfigFilePath = join(this.configPath, this.configFileName)
  configFilePath = join(this.wwwFolderPath, this.configFileName)
  md5FilePath = join(this.wwwFolderPath, this.md5FileName)
  versionFilePath = join(this.distPath, this.versionFileName)
  staticPath = join(this.distPath, this.staticDir)
  android = Util.projectPath('platforms/android/app/src/main/assets/weexbox-update')
  ios = Util.projectPath('platforms/ios/weexbox-update')
  androidStaticPath = join(this.android, this.staticDir)
  iosStaticPath = join(this.ios, this.staticDir)
  weexboxConfigPath = Util.projectPath('config/weexbox-config.js')
}
