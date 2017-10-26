const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')

const NEW_LINE = '\r\n'
const DEFAULT_MARKDOWN_OPTIONS = {
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }
    return '' // use external default escaping
  }
}

// https://github.com/QingWei-Li/vue-markdown-loader/blob/master/lib/markdown-compiler.js
// Apply `v-pre` to `<pre>` and `<code>` tags
const ensureVPre = function (markdown) {
  if (markdown && markdown.renderer && markdown.renderer.rules) {
    let rules = ['code_inline', 'code_block', 'fence']
    let rendererRules = markdown.renderer.rules
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
  // default options
  const defaultOptions = {
    live: true, // enable live
    livePattern: /<!--[\s]*?([-\w]+?).vue[\s]*?-->/i,
    liveTemplateProcessor: null,
    markdown: Object.assign({}, DEFAULT_MARKDOWN_OPTIONS), // Markdown-It options
    rules: {}, // Markdown-It rules
    plugins: [], // Markdown-It plugins
    wrapper: 'section' // content wrapper
  }
  // merge user options into defaults
  const options = Object.assign({}, defaultOptions, _options)
  options.markdown = Object.assign({}, options.markdown)
  this.options = options
  // init MarkdownIt instance
  this.markdown = new MarkdownIt(this.options.markdown)
  // v-pre must be set
  ensureVPre(this.markdown)
  // apply rules
  if (this.options.rules) {
    let rendererRules = this.markdown.renderer.rules
    let userRules = this.options.rules
    for (let key in userRules) {
      if (userRules.hasOwnProperty(key) && typeof userRules[key] === 'function') {
        rendererRules[key] = userRules[key]
      }
    }
  }
  // install plugins
  if (this.options.plugins && this.options.plugins.length) {
    this.options.plugins.forEach(p => {
      if (Array.isArray(p)) {
        if (p[0]) {
          this.markdown.use.apply(this.markdown, p)
        }
      } else if (p) {
        this.markdown.use(p)
      }
    })
  }
  this.reset()
}

Parser.prototype.reset = function () {
  this.source = ''
  this.lives = []
}

Parser.prototype.parseLives = function () {
  this.fetchLives()
  return this.assembleLives()
}

Parser.prototype.fetchLives = function () {
  const PRE_REGEX = /```.*?[\n\r]([\S\s]+?)[\n\r]```/igm
  this.lives = []
  let live = null
  do {
    live = PRE_REGEX.exec(this.source)
    if (live) {
      let liveName = this.options.livePattern.exec(live[1])
      if (liveName) {
        live._templateName = liveName[1]
        this.lives.push(live)
      }
    }
  } while (live)
  this.fetchLiveTemplates()
  this.fetchLiveStyles()
  this.fetchLiveScripts()
}

Parser.prototype.fetchLiveTemplates = function () {
  this.lives.forEach(live => {
    // greedy
    let template = /<template>([\s\S]*)<\/template>/.exec(live[1])
    if (template) {
      // <template> founded, using it
      template = template[1]
    } else {
      // <template> not found, using the entire code block as template
      template = live[1]
    }
    // Wrap it by options
    if (this.options.liveTemplateProcessor && typeof this.options.liveTemplateProcessor === 'function') {
      template = this.options.liveTemplateProcessor(template)
    }
    // mount it to the live obj
    live._template = template
  })
}

Parser.prototype.fetchLiveScripts = function () {
  this.lives.forEach(live => {
    // mount script inside live block
    live._script = /<script.*?>([\S\s]+?)<\/script>/.exec(live[1])
  })
}

Parser.prototype.fetchLiveStyles = function () {
  this.lives.forEach(live => {
    // mount style inside live block
    live._style = /<style.*?>([\S\s]+?)<\/style>/.exec(live[1])
  })
}

Parser.prototype.assembleLives = function () {
  // Scripts goes first because it will change templates if live block found
  let script = this.assembleLiveScripts()
  let style = this.assembleLiveStyles()
  let template = this.assembleLiveTemplates()
  return {
    script: script,
    style: style,
    template: template
  }
}

Parser.prototype.assembleLiveTemplates = function () {
  let template = this.source
  for (let i = this.lives.length - 1; i >= 0; i--) {
    let live = this.lives[i]
    // Replace the original template with the created component and add refs
    let _template = `<${live._templateName} ref="${live._templateName}"/>`
    // Insert component before it's live block
    template =
      template.slice(0, live.index) +
      NEW_LINE + NEW_LINE +
      _template +
      NEW_LINE + NEW_LINE +
      template.slice(live.index)
  }
  return template
}

Parser.prototype.assembleLiveStyles = function () {
  let style = ''
  this.lives.forEach(live => {
    style += live._style ? live._style[0] : ''
  })
  return style
}

Parser.prototype.assembleLiveScripts = function () {
  let script = '<script>'
  let exports = ''
  let beforeExports = []
  this.lives.forEach((live, index) => {
    let componentOptions = null
    if (live._script) {
      let _script = live._script[1]
      // Anything before `export default` will append in front
      let _before = /([\s\S]*?)export[\s]+?default/.exec(_script)
      if (_before) {
        beforeExports.push(_before[1])
      }
      // Anything inside `export default` will be created as a new component with it's template string
      componentOptions = /export[\s]+?default[\s]*?{([\s\S]*)}/.exec(_script)
    }
    // Get "template": "......"
    let _template = /^{([\s\S]*?)}$/.exec(JSON.stringify({template: live._template}))
    if (_template) {
      componentOptions = componentOptions ? `,${componentOptions[1]}` : ``
      exports += `'${live._templateName}':{${_template[1]}${componentOptions}}`
      // Add ',' if not the last live component
      exports += index === this.lives.length - 1 ? '' : ','
    }
  })
  exports = `export default {components:{${exports}}}`
  beforeExports.forEach(code => {
    script += code + NEW_LINE
  })
  script += exports
  script += '</script>'
  return script
}

Parser.prototype.parse = function (source) {
  this.reset()
  this.source = source
  let result = this.options.live ? this.parseLives() : {template: source, script: '', style: ''}
  let html = this.markdown.render(result.template)
  let vueFile = `<template><${this.options.wrapper}>${html}</${this.options.wrapper}></template>${result.style}${result.script}`
  return vueFile
}

module.exports = Parser
