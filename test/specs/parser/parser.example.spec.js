const path = require('path')
const fs = require('fs')
const expect = require('chai').expect
const cheerio = require('cheerio').default
const utils = require('../../utils')
const Parser = require('../../../src/parser')

const markdown = fs.readFileSync(path.resolve(__dirname, '../../../example/src/markdown.md'), 'UTF-8')
const options = {
  afterProcessLiveTemplate: function (template) {
    return `<div class="live-wrapper">${template}</div>`
  },
  rules: {
    table_open: () => '<div class="table-responsive"><table class="table">',
    table_close: () => '</table></div>'
  },
  plugins: [
    [
      require('markdown-it-anchor'),
      {
        permalink: true,
        permalinkSymbol: '&#128279;'
      }
    ]
  ]
}

describe('#example', () => {
  let html, parser, $

  before(() => {
    parser = new Parser(options)
    html = parser.parse(markdown)
    $ = utils.loadHtml(html)
  })

  it('should assemble correct script', () => {
    // 1 script tag at the end.
    expect(cheerio('script', html).length).to.equal(1)
  })

  it('should assemble correct styles', () => {
    // 1 script tag at the end.
    expect(cheerio('style', html).length).to.above(1)
  })

  it('should be ale to use `afterProcessLiveTemplate`', () => {
    const match = /<div class=[\\]?"live-wrapper[\\]?">[\s\S]*?<\/div>/
    expect(match.exec(html)).to.exist
  })

  it('should be ale to use `markdown-it-anchor` plugin', () => {
    const anchors = $('[id]:header')
    const link = anchors.find('a.header-anchor')
    expect(anchors.length).to.above(0)
    expect(anchors.length).to.equal(link.length)
  })
})
