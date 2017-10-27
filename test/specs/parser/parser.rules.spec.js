const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const Parser = require('../../../src/parser')
const utils = require('../../utils')
const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#rules', () => {
  it('should be able to enforce `v-pre`', () => {
    let parser = new Parser()
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    let codes = $('pre, code')
    for (let i = 0; i < codes.length; i++) {
      let $code = $(codes[i])
      expect($code.attr('v-pre')).to.exist
    }
  })

  it('should be able to apply rule', () => {
    let parser = new Parser({rules: {'table_open': () => '<table class="table">'}})
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    expect($('table').length).to.equal($('.table').length)
  })

  it('should be ok if rules is null', () => {
    let parser = new Parser({rules: null})
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    expect($('table')).to.have.lengthOf(2)
  })

  it('should be ok if rule is invalid', () => {
    let parser = new Parser({rules: {'table_open': 123123}})
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    expect($('table')).to.have.lengthOf(2)
  })
})
