const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')

const NEW_LINE = '\r\n'

const md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }
    return '' // use external default escaping
  }
})

function Parser (_options) {
  this.options = {
    livePattern: /<!-- Live demo -->/,
    liveScriptPattern: /<!-- Live demo script([\S\s]+?)-->/,
    liveWrapper: null,
    md: md
  }
  Object.assign(this.options, _options)
  this.source = ''
  this.result = ''
  this.lives = []
}

Parser.prototype.fetchLiveBlocks = function () {
  const PRE_REGEX = /```.*?[\n\r]([\S\s]+?)[\n\r]```/igm
  this.lives = []
  let match = null
  do {
    match = PRE_REGEX.exec(this.source)
    if (match && this.options.livePattern.exec(match[0])) {
      this.lives.push(match)
    }
  } while (match)
  // console.log('fetchLiveBlocks:', this.lives.length, this.lives)
}

Parser.prototype.fetchLiveTemplates = function () {
  const TEMPLATE_REGEX = /<template>([\s\S]*)<\/template>/
  // Loop code blocks for operations
  this.lives.forEach(live => {
    // Fetch template string in code block
    let template = TEMPLATE_REGEX.exec(live[1])
    if (template) {
      template = template[0]
    } else {
      template = live[1]
    }
    if (this.options.liveWrapper && typeof this.options.liveWrapper === 'function') {
      template = this.options.liveWrapper(template)
    }
    live._template = template
  })
  // console.log('fetchLiveTemplates:', this.liveTemplates.length, this.liveTemplates)
}

Parser.prototype.fetchLiveStylesheets = function () {
  const DEMO_CSS_REGEX = /<style.*?>([\S\s]+?)<\/style>/
  this.lives.forEach(live => {
    let style = DEMO_CSS_REGEX.exec(live[1])
    if (style) {
      live._style = style[0]
    }
  })
}

Parser.prototype.assembleLiveTemplates = function () {
  for (let i = this.lives.length - 1; i >= 0; i--) {
    let live = this.lives[i]
    this.result = this.result.slice(0, live.index) + live._template + NEW_LINE + NEW_LINE + this.result.slice(live.index)
  }
  // console.log('assembleLiveTemplates:\n\r', this.result)
}

Parser.prototype.parse = function (source) {
  this.source = this.result = source
  this.fetchLiveBlocks()
  this.fetchLiveTemplates()
  this.fetchLiveStylesheets()
  this.assembleLiveTemplates()
  let demoScript = this.options.liveScriptPattern.exec(this.result)
  if (demoScript) {
    this.result = this.result.replace(demoScript[0], demoScript[1])
  }
  // Assemble stylesheet
  let styles = ''
  this.lives.forEach(live => {
    styles += live._style ? live._style : ''
  })
  // console.log('-------------\n', result)
  // Markdown -> HTML
  let html = this.options.md.render(this.result)
  return `
<template>
<section>${html}</section>
</template>
${styles}
`
}

module.exports = Parser
