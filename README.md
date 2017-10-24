# vue-md-loader

[![Build Status](https://travis-ci.org/wxsms/vue-md-loader.svg?branch=master)](https://travis-ci.org/wxsms/vue-md-loader)
[![NPM Version](https://img.shields.io/npm/v/vue-md-loader.svg)](https://www.npmjs.com/package/vue-md-loader)
[![License](https://img.shields.io/github/license/wxsms/vue-md-loader.svg)](https://github.com/wxsms/vue-md-loader)

## Introduction

Convert Markdown file to Vue Component.

* Configurable **[Markdown-It](https://github.com/markdown-it/markdown-it)** parser.
* Built-in **syntax highlighter** with **[highlightjs](https://highlightjs.org/)**.
* **Live demo** support. Extremely useful for document examples.
* Hot reload.

## Install

NPM:

```bash
npm install vue-md-loader --save-dev
```

Yarn:

```bash
yarn add vue-md-loader --dev
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

Multiple lives inside a single markdown file is supported with some conditions:

* All `<script>` from different code blocks:
  * code before `export default` will be extract into the same top-level component. Which means they should not be conflict with each others.
  * code inside `export default` will be extract into it's own Vue component with no conflicts.
* All `<style>` from different code blocks will be extract into the same top-level component. Which means they should not be conflict with each others.

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

## Options

### live

Boolean. Default: `true`

Enable / Disable live detecting and assembling.

### livePattern

Regex. Default: `/<!--[\s]*?([-\w]+?).vue[\s]*?-->/i`

A code block with `livePattern` inside itself becomes a live block. The matched body will become the live Vue component's name and reference.

### liveTemplateProcessor

Function. Default: `null`

Use this if you wish to change the live template manually (e.g. add wrappers). For example:

```javascript
function wrapIt (template) {
  return `<div class="live-wrapper">${template}</div>`
}
```

### md

Object. Default:

```javascript
new MarkdownIt({
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
```

Use this to replace the Markdown-It instance inside the loader.

### plugins

Array. Default: `[]`

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

### wrapper

String. Default: `section`

The wrapper of entire markdown content, can be HTML tag name or Vue component name.
