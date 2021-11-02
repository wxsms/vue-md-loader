const fs = require('fs')
const path = require('path')
const Parser = require('../src/parser')
const cheerio = require('cheerio')
const anchor = require('markdown-it-anchor')

const markdown = fs.readFileSync(path.resolve(__dirname, 'test.md'), {
  encoding: 'utf8',
})

describe('#hooks', () => {
  it('preProcess', () => {
    const preProcess = jest.fn((a) => {
      return a.replace('# test', '# EMT YES')
    })
    const parser = new Parser({
      preProcess,
    })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect(preProcess).toBeCalled()
    expect($('h1').text()).toEqual('EMT YES')
  })

  it('afterProcess', () => {
    const afterProcess = jest.fn((a) => {
      return a.replace('<h1>test</h1>', '<h1>EMT YES</h1>')
    })
    const parser = new Parser({
      afterProcess,
    })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect(afterProcess).toBeCalled()
    expect($('h1').text()).toEqual('EMT YES')
  })

  it('process', () => {
    const process = jest.fn((source) => {
      return {
        template: source,
        style: '',
        script: `export default {
      head(){
        return {
          title: 'EMT YES'
        }
      }
    }`,
      }
    })
    const parser = new Parser({
      process,
    })
    const $ = cheerio.load(parser.parse(markdown))
    expect(process).toBeCalled()
    expect($('script').html()).toContain("title: 'EMT YES'")
  })

  it('process with no script', () => {
    const process = jest.fn((source) => {
      return {
        template: source,
        style: '',
      }
    })
    const parser = new Parser({
      process,
    })
    const $ = cheerio.load(parser.parse(markdown))
    expect(process).toBeCalled()
    expect($('script').html()).toEqual('')
  })
})

describe('#plugins', () => {
  it('should be able to apply plugin', () => {
    const parser = new Parser({
      plugins: [anchor],
    })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
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
    const $ = cheerio.load(html)
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
    const $ = cheerio.load(html)
    const anchors = $('[id]:header')
    expect(anchors.length).toEqual(0)
  })
})

describe('#rules', () => {
  it('should be able to enforce `v-pre`', () => {
    const parser = new Parser()
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    const codes = $('pre, code')
    for (let i = 0; i < codes.length; i++) {
      const $code = $(codes[i])
      expect($code.attr('v-pre')).toBeDefined()
    }
  })

  it('should be able to apply rule', () => {
    const parser = new Parser({
      rules: { table_open: () => '<table class="table">' },
    })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect($('table').length).toEqual($('.table').length)
  })

  it('should be ok if rules is null', () => {
    const parser = new Parser({ rules: null })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect($('table').length).toEqual(2)
  })

  it('should be ok if rule is invalid', () => {
    const parser = new Parser({ rules: { table_open: 123123 } })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect($('table').length).toEqual(2)
  })
})

describe('#highlight', () => {
  let parser, html, $

  beforeEach(() => {
    parser = new Parser()
    html = parser.parse(markdown)
    $ = cheerio.load(html)
  })

  it('should highlight with lang if exist', () => {
    const code = $('code')
    expect(code.length).toBeGreaterThanOrEqual(3)
    expect($(code.get(0)).hasClass('language-html')).toBeTruthy()
    expect($(code.get(1)).hasClass('language-javascript')).toBeTruthy()
    expect($(code.get(2)).attr('class')).not.toBeDefined()
  })
})

describe('#live', () => {
  it('should be able to disable live', () => {
    const parser = new Parser({
      live: false,
    })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect($('script').length).toEqual(0)
  })

  it('should be able to enable live', () => {
    const parser = new Parser({
      // live: true,
    })
    const html = parser.parse(markdown)
    const $ = cheerio.load(html)
    expect($('script').length).toEqual(1)
  })
})
