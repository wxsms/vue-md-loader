const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const specRegex = /^.+\.spec\.js$/

module.exports.getSpecFilesByDir = (dirname, dir) => {
  let arr = []
  fs.readdirSync(path.join(dirname, dir)).forEach((file) => {
    if (specRegex.test(file)) {
      arr.push(dir + '/' + file)
    }
  })
  return arr
}

module.exports.loadHtml = (html) => {
  return cheerio.load(/<template>([\s\S]+)<\/template>/.exec(html)[1])
}
