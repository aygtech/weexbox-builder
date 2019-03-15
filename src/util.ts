import { join } from 'path'

export default class Util {
  static projectPath(path: string): string {
    return join(process.cwd(), path)
  }
}