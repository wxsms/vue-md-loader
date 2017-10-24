const path = require('path')
const fs = require('fs')

fs.readdirSync(path.join(__dirname, './specs')).forEach(file => {
  require('./specs/' + file)
})
