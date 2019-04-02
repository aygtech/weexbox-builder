import { join } from 'path'
import Context from './update/context'

export default class Util {
  static projectPath(path: string): string {
    return join(process.cwd(), path)
  }

  static entries() {
    const pagePath = helper.projectPath(context.so)
  }
}
// 多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.getEntries = function (target) {
  const pagePath = helper.projectPath(config.sourceDir)
  return entries(`${pagePath  }/*/*/index.js`, target)
}

function entries(globPath, target) {
  const entries = {}
  /**
   * 读取src目录,并进行路径裁剪
   */
  glob.sync(globPath).forEach((indexEntry) => {
    const tmp = indexEntry.split('/').splice(-3)
    // var moduleName = tmp.slice(1, 2).toString()
    const moduleName = `${tmp.slice(0, 1).toString()}/${tmp.slice(1, 2).toString()}`
    if (target === 'web') {
      const renderEntry = indexEntry.replace('index.js', 'render.js')
      entries[moduleName] = [renderEntry, indexEntry]
    } else {
      entries[moduleName] = [indexEntry]
    }
  })
  // console.log(JSON.stringify(entries))
  return entries
}
