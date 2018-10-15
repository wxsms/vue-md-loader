# vue-md-loader

[![Build Status](https://travis-ci.org/wxsms/vue-md-loader.svg?branch=master)](https://travis-ci.org/wxsms/vue-md-loader)
[![Coverage Status](https://coveralls.io/repos/github/wxsms/vue-md-loader/badge.svg?branch=master)](https://coveralls.io/github/wxsms/vue-md-loader?branch=master)
[![NPM Version](https://img.shields.io/npm/v/vue-md-loader.svg)](https://www.npmjs.com/package/vue-md-loader)
[![License](https://img.shields.io/github/license/wxsms/vue-md-loader.svg)](https://github.com/wxsms/vue-md-loader)

## Introduction

Webpack loader for converting Markdown files to ALIVE Vue components.

* Configurable **[Markdown-It](https://github.com/markdown-it/markdown-it)** parser.
* Built-in **syntax highlighter** with **[highlightjs](https://highlightjs.org/)**.
* **Live demo** support. Extremely useful for document examples.
* Hot reload.

## Example

* [Example project](https://github.com/wxsms/vue-md-loader/tree/master/example)
* [https://github.com/wxsms/uiv](https://github.com/wxsms/uiv)

## Install

NPM:

```bash
npm install vue-md-loader --save-dev
```

Yarn:

```bash
yarn add vue-md-loader --dev
```

## Usage

### Basic

Simply **use `vue-md-loader`** to load `.md` files and **chain it with your `vue-loader`**.

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.md$/,
        loader: 'vue-loader!vue-md-loader'
      }
    ]
  }
}
```

Note that to get code highlighting to work, you need to:

* include one of the highlight.js css files into your project, for example: `highlight.js/styles/github-gist.css`.
* specify a lang in code block. ref: [creating and highlighting code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/).

### With Options

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.md$/,
        loaders: [
          'vue-loader',
          {
            loader: 'vue-md-loader',
            options: {
              // your preferred options
            }
          }
        ]
      }
    ]
  }
}
```

## Markdown Alive!

A live demo is:

```html
<template>
  <div class="cls">{{msg}}</div>
</template>
<script>
  export default {
    data () {
      return {
        msg: 'Hello world!'
      }
    }
  }
</script>
<style>
  .cls {
    color: red;
    background: green;
  }
</style>
<!-- some-live-demo.vue -->
```

becomes something like:

```html
<some-live-demo/>
<pre><code>...</code></pre>
```

A **Vue component** with all it's `<template>`, `<script>` and `<style>` settled will be **inserted before it's source code block**.

Multiple lives inside a single markdown file is supported by:

* All `<script>` from different code blocks:
  * code **inside** `export default` will be extract into it's own Vue component with no conflicts.
  * code **before** `export default` will be extract into the same top-level component.
* All `<style>` from different code blocks will be extract into the same top-level component.

**Note:** 

* Loader will treat the entire block as template if no `<template>` found in live block.
* You will need runtime + compiler build of Vue.js for this feature. For example:

```javascript
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  }
}
```

## Options

### wrapper

String. Default: `section`

The wrapper of entire markdown content, can be HTML tag name or Vue component name.

### markdown

Object.

Markdown-It options. Default:

```javascript
{
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }
    return ''
  }
}
```

### plugins

Array.

Markdown-It plugins list. For example:

```javascript
// ...
plugins: [
  // Without option
  require('markdown-it-plugin-1'),
  // With options
  [
    require('markdown-it-plugin-2'),
    {
      // ...
    }
  ]
]
// ...
```

### rules

Object.

Markdown-It renderer rules. For example:

```javascript
rules: {
  'table_open': () => '<div class="table-responsive"><table class="table">',
  'table_close': () => '</table></div>'
}
```

### preProcess

Function. For example:

```javascript
preProcess: function(source) {
  // do anything
  return source
}
```

### process

Function. For example
```javascript
// This is useful when used with front-matter-loader to set the page title in nuxt projects
process: function(source){
  let attrs = (source && source.attributes) || {}
  attrs.title = attrs.title || ""
  return {
    template: source.body,
    style: "",
    script: `export default {
      head(){
        return {
          title: '${attrs.title}'
        }
      }
    }`
  }
}
```

### afterProcess

Function. For example:

```javascript
afterProcess: function(result) {
  // do anything
  return result
}
```

### live

Boolean. Default: `true`

Enable / Disable live detecting and assembling.

### livePattern

Regex. Default: `/<!--[\s]*?([-\w]+?).vue[\s]*?-->/i`

A code block with `livePattern` inside itself becomes a live block. The matched body will become the live Vue component's name and reference (note that they must be unique to each other within the same page).

### afterProcessLiveTemplate

Function. Default: `null`

Use this if you wish to change the live template manually after process (e.g. add wrappers). For example:

```javascript
afterProcessLiveTemplate: function(template) {
  return `<div class="live-wrapper">${template}</div>`
}
```

## Build Setup

```bash
# install dependencies
npm install

# serve example with hot reload at localhost:8888
npm run dev

# run all tests
npm test
```

## License

MIT
