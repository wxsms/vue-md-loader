const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const Parser = require('../../../src/parser')
const utils = require('../../utils')
const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#plugins', () => {
  it('should be able to apply plugin', () => {
    const parser = new Parser({
      plugins: [require('markdown-it-anchor')],
    })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const anchors = $('[id]:header')
    expect(anchors.length).to.above(0)
  })

  it('should be able to apply plugin with options', () => {
    const parser = new Parser({
      plugins: [
        [
          require('markdown-it-anchor'),
          {
            permalink: true,
            permalinkSymbol: '&#128279;',
          },
        ],
      ],
    })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const anchors = $('[id]:header')
    const link = anchors.find('a.header-anchor')
    expect(anchors.length).to.above(0)
    expect(anchors.length).to.equal(link.length)
  })

  it('should be ok if plugin invalid', () => {
    const parser = new Parser({
      plugins: [null, [null, null]],
    })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const anchors = $('[id]:header')
    expect(anchors.length).to.equal(0)
  })
})
