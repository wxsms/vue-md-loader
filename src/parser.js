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

const ensureVPre = function (md) {
  if (md && md.renderer && md.renderer.rules) {
    let rules = ['code_inline', 'code_block', 'fence']
    let rendererRules = md.renderer.rules
    rules.forEach(function (rule) {
      if (rendererRules.hasOwnProperty(rule) && typeof rendererRules[rule] === 'function') {
        let saved = rendererRules[rule]
        rendererRules[rule] = function () {
          return saved.apply(this, arguments).replace(/(<pre|<code)/g, '$1 v-pre')
        }
      }
    })
  }
}

function Parser (_options) {
  this.options = {
    livePattern: /<!-- Live demo -->/,
    liveScriptPattern: /<!-- Live demo script([\S\s]+?)-->/,
    liveWrapper: null,
    md: md
  }
  Object.assign(this.options, _options)
  ensureVPre(this.options.md)
  this.reset()
}

Parser.prototype.reset = function () {
  this.source = ''
  this.result = ''
  this.lives = []
  this.script = ''
  this.style = ''
}

Parser.prototype.parseLives = function () {
  this.fetchLives()
  this.assembleLives()
}

Parser.prototype.fetchLives = function () {
  const PRE_REGEX = /```.*?[\n\r]([\S\s]+?)[\n\r]```/igm
  this.lives = []
  let match = null
  do {
    match = PRE_REGEX.exec(this.source)
    if (match && this.options.livePattern.exec(match[0])) {
      this.lives.push(match)
    }
  } while (match)
  this.fetchLiveTemplates()
  this.fetchLiveStyles()
  this.fetchLiveScripts()
  // console.log('fetchLiveBlocks:', this.lives.length, this.lives)
}

Parser.prototype.fetchLiveTemplates = function () {
  // Loop code blocks for operations
  let self = this
  this.lives.forEach(function (live) {
    // Fetch template string in code block
    let template = /<template>([\s\S]*)<\/template>/.exec(live[1])
    if (template) {
      template = template[0]
    } else {
      template = live[1]
    }
    if (self.options.liveWrapper && typeof self.options.liveWrapper === 'function') {
      template = self.options.liveWrapper(template)
    }
    live._template = template
  })
  // console.log('fetchLiveTemplates:', this.liveTemplates.length, this.liveTemplates)
}

Parser.prototype.fetchLiveScripts = function () {
  this.lives.forEach(function (live) {
    live._script = /<script.*?>([\S\s]+?)<\/script>/.exec(live[1])
  })
}

Parser.prototype.fetchLiveStyles = function () {
  this.lives.forEach(function (live) {
    live._style = /<style.*?>([\S\s]+?)<\/style>/.exec(live[1])
  })
}

Parser.prototype.assembleLives = function () {
  this.script = this.assembleLiveScripts()
  this.style = this.assembleLiveStyles()
  this.assembleLiveTemplates()
}

Parser.prototype.assembleLiveTemplates = function () {
  for (let i = this.lives.length - 1; i >= 0; i--) {
    let live = this.lives[i]
    this.result = this.result.slice(0, live.index) + live._template + NEW_LINE + NEW_LINE + this.result.slice(live.index)
  }
  // console.log('assembleLiveTemplates:\n\r', this.result)
}

Parser.prototype.assembleLiveStyles = function () {
  let style = ''
  this.lives.forEach(function (live) {
    style += live._style ? live._style[0] : ''
  })
  return style
}

Parser.prototype.assembleLiveScripts = function () {
  const COMPONENT_NAME = 'MarkdownLiveDemo'
  const COMPONENT_NAME_TAG = 'markdown-live-demo'
  let script = '<script>import Vue from \'vue\''
  let before = []
  let after = []
  this.lives.forEach(function (live) {
    if (!live._script) {
      return
    }
    let _script = live._script[1]
    let _before = /([\s\S]*?)export[\s]+?default/.exec(_script)
    if (_before) {
      before.push(_before[1])
    }
    let _after = /export[\s]+?default[\s]*?{([\s\S]*)}/.exec(_script)
    if (_after) {
      let template = live._template.replace(/[\n\r]/g, '')
      after.push('let __' + COMPONENT_NAME + after.length + '=Vue.extend({template:\'' + template + '\',' + _after[1] + '})')
      live._template = '<' + COMPONENT_NAME_TAG + '-' + (after.length - 1) + '/>'
    }
  })
  before.forEach(function (code) {
    script += code + NEW_LINE
  })
  after.forEach(function (code) {
    script += code + NEW_LINE
  })
  script += 'export default {components:{'
  after.forEach(function (code, index) {
    script += COMPONENT_NAME + index + ': __' + COMPONENT_NAME + index
    if (index !== after.length - 1) {
      script += ','
    }
  })
  script += '}}'
  script += '</script>'
  // console.log(script)
  return script
}

Parser.prototype.parse = function (source) {
  this.reset()
  this.source = this.result = source
  this.parseLives()
  let html = this.options.md.render(this.result)
  return '<template><section>' + html + '</section></template>' + this.style + this.script
}

module.exports = Parser
