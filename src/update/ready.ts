import Context from './context'
import { readJsonSync, renameSync, outputFileSync } from 'fs-extra'
import { join } from 'path'

export default class Ready {
  static ready() {
    const context = new Context()
    const config = readJsonSync(context.configFilePath)
    const version = config.release.replace(/\./g, '')
    const wwwFolderPath = context.wwwFolderPath
    renameSync(wwwFolderPath, join(wwwFolderPath, `../${version}`))
    outputFileSync(context.versionFilePath, version)
  }
}
