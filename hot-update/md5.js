const path = require('path')
const fs = require('fs-extra')
const async = require('async')
const crypto = require('crypto')
const Q = require('q')
const recursive = require('recursive-readdir')
const hidefile = require('hidefile')
const timestamp = require('time-stamp')
const context = require('./context')
let csContext = null

function execute() {
  const executeDfd = Q.defer()
  csContext = context.csContext()
  const config = prepareConfig(csContext)

  recursive(csContext.wwwFolderPath, csContext.ignoredList, (err, files) => {
    const hashQueue = prepareFilesHashQueue(files)

    async.parallelLimit(hashQueue, 10, (err, result) => {
      result.sort((a, b) => {
        return a.path.localeCompare(b.path)
      })
      const json = JSON.stringify(result, null, 2)

      fs.writeFile(csContext.md5FilePath, json, (err) => {
        if (err) {
          return console.log(err)
        }

        const json = JSON.stringify(config, null, 2)
        fs.writeFile(csContext.configFilePath, json, (err) => {
          if (err) {
            return console.log(err)
          }
          // console.log(`已生成 config 文件`)
          // console.log(`目录： ${csContext.wwwFolderPath}`)
          // console.log(`版本： ${config.release}`)
          executeDfd.resolve(config)
        })
      })
    })
  })

  return executeDfd.promise
}

function prepareFilesHashQueue(files) {
  const queue = []
  for (const i in files) {
    const file = files[i]
    if (!hidefile.isHiddenSync(file)) {
      queue.push(hashFile.bind(null, file))
    }
  }

  return queue
}

function prepareConfig(context) {
  let config = {}
  try {
    config = fs.readFileSync(context.defaultConfigFilePath, 'utf8')
    config = JSON.parse(config)
    config.release = process.env.VERSION || calculateTimestamp()
  } catch (e) {
    config = {
      autogenerated: true,
      release: calculateTimestamp()
    }
  }

  return config
}

function hashFile(filename, callback) {
  const hash = crypto.createHash('md5')
  const stream = fs.createReadStream(filename)

  stream.on('data', (data) => {
    hash.update(data, 'utf8')
  })

  stream.on('end', () => {
    const result = hash.digest('hex')
    const file = path.relative(csContext.wwwFolderPath, filename).replace(new RegExp("\\\\", "g"), "/")

    callback(null, {
      path: file,
      md5: result
    })
  })
}

function calculateTimestamp() {
  return timestamp('YYYY.MM.DD.HH.mm.ss')
}

exports.execute = execute

