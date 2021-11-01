const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const Parser = require('../src/parser')

const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#highlight', () => {
  let parser, html, $
  beforeEach(() => {
    parser = new Parser()
    html = parser.parse(markdown)
    $ = utils.loadHtml(html)
  })
  it('should highlight with lang if exist', () => {
    const code = $('code')
    expect(code.length).toBeGreaterThanOrEqual(3)
    expect($(code.get(0)).hasClass('language-html')).toBeTruthy()
    expect($(code.get(1)).hasClass('language-javascript')).toBeTruthy()
    expect($(code.get(2)).attr('class')).not.toBeDefined()
  })
})
