const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const utils = require('../../utils')
const Parser = require('../../../src/parser')

const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#highlight', () => {
  let parser, html, $
  before(() => {
    parser = new Parser()
    html = parser.parse(markdown)
    $ = utils.loadHtml(html)
  })
  it('should highlight with lang if exist', () => {
    const code = $('code')
    expect(code).to.have.lengthOf.least(3)
    expect($(code.get(0)).hasClass('language-html')).to.be.true
    expect($(code.get(1)).hasClass('language-javascript')).to.be.true
    expect($(code.get(2)).attr('class')).not.exist
  })
})
