const utils = require('./utils')

utils.getSpecFilesByDir(__dirname, './specs').forEach(file => {
  require(file)
})
