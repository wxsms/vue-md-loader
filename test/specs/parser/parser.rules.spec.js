const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const Parser = require('../../../src/parser')
const utils = require('../../utils')
const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#rules', () => {
  it('should be able to enforce `v-pre`', () => {
    const parser = new Parser()
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const codes = $('pre, code')
    for (let i = 0; i < codes.length; i++) {
      const $code = $(codes[i])
      expect($code.attr('v-pre')).to.exist
    }
  })

  it('should be able to apply rule', () => {
    const parser = new Parser({ rules: { table_open: () => '<table class="table">' } })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    expect($('table').length).to.equal($('.table').length)
  })

  it('should be ok if rules is null', () => {
    const parser = new Parser({ rules: null })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    expect($('table')).to.have.lengthOf(2)
  })

  it('should be ok if rule is invalid', () => {
    const parser = new Parser({ rules: { table_open: 123123 } })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    expect($('table')).to.have.lengthOf(2)
  })
})
