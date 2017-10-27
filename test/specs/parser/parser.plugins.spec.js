const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const Parser = require('../../../src/parser')
const utils = require('../../utils')
const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#plugins', () => {
  it('should be able to apply plugin', () => {
    let parser = new Parser({
      plugins: [require('markdown-it-anchor')]
    })
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    let anchors = $('[id]:header')
    expect(anchors.length).to.above(0)
  })

  it('should be able to apply plugin with options', () => {
    let parser = new Parser({
      plugins: [
        [
          require('markdown-it-anchor'),
          {
            permalink: true,
            permalinkSymbol: '&#128279;'
          }
        ]
      ]
    })
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    let anchors = $('[id]:header')
    let link = anchors.find('a.header-anchor')
    expect(anchors.length).to.above(0)
    expect(anchors.length).to.equal(link.length)
  })

  it('should be ok if plugin invalid', () => {
    let parser = new Parser({
      plugins: [null, [null, null]]
    })
    let html = parser.parse(markdown)
    let $ = utils.loadHtml(html)
    let anchors = $('[id]:header')
    expect(anchors.length).to.equal(0)
  })
})
