const fs = require('fs')
const path = require('path')
const Parser = require('../src/parser')
const utils = require('./utils')
const anchor = require('markdown-it-anchor')
const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'UTF-8')

describe('#plugins', () => {
  it('should be able to apply plugin', () => {
    const parser = new Parser({
      plugins: [anchor],
    })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const anchors = $('[id]:header')
    expect(anchors.length).toBeGreaterThan(0)
  })

  it('should be able to apply plugin with options', () => {
    const parser = new Parser({
      plugins: [
        [
          anchor,
          {
            permalink: anchor.permalink.headerLink({
              symbol: '&#128279;',
            }),
          },
        ],
      ],
    })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const anchors = $('[id]:header')
    const link = anchors.find('a.header-anchor')
    expect(anchors.length).toBeGreaterThan(0)
    expect(anchors.length).toEqual(link.length)
  })

  it('should be ok if plugin invalid', () => {
    const parser = new Parser({
      plugins: [null, [null, null]],
    })
    const html = parser.parse(markdown)
    const $ = utils.loadHtml(html)
    const anchors = $('[id]:header')
    expect(anchors.length).toEqual(0)
  })
})
