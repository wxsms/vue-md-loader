const utils = require('../utils')

describe('Parser', () => {
  utils.getSpecFilesByDir(__dirname, './parser').forEach((file) => {
    require(file)
  })
})
