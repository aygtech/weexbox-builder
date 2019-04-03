import { join } from 'path'
import { sync } from 'glob'
import Context from './update/context'

export default class Util {
  static projectPath(path: string): string {
    return join(process.cwd(), path)
  }

  static entries(): Map<string, string> {
    const context = new Context()
    const pagePath = this.projectPath(context.sourceDir)
    console.log(pagePath)
    const entries = new Map<string, string>()
    sync(pagePath).forEach((indexEntry) => {
      const tmp = indexEntry.split('/').splice(-3)
      const moduleName = `${tmp.slice(0, 1).toString()}/${tmp.slice(1, 2).toString()}`
      entries[moduleName] = [indexEntry]
    })
    console.log(JSON.stringify(entries))
    return entries
  }
}

