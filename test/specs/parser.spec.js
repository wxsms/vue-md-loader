const path = require('path')
const fs = require('fs')
const assert = require('assert')
const $ = require('cheerio')
const Parser = require('./../../src/parser')

const markdown = fs.readFileSync(path.resolve(__dirname, '../../example/src/markdown.md'))

describe('Parser', () => {
  let html
  let parser

  beforeEach(() => {
    parser = new Parser()
    html = parser.parse(markdown)
  })

  afterEach(() => {
    html = null
    parser = null
  })

  it('should assemble correct script', () => {
    // 1 script tag at the end.
    assert.equal($('script', html).length, 1)
    // TODO
  })
})
