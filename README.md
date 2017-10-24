# vue-md-loader

[![Build Status](https://travis-ci.org/wxsms/vue-md-loader.svg?branch=master)](https://travis-ci.org/wxsms/vue-md-loader)
[![NPM Version](https://img.shields.io/npm/v/vue-md-loader.svg)](https://www.npmjs.com/package/vue-md-loader)
[![License](https://img.shields.io/github/license/wxsms/vue-md-loader.svg)](https://github.com/wxsms/vue-md-loader)

## Introduction

Webpack loader for converting Markdown files to Vue components.

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

## Usage

[Example project](https://github.com/wxsms/vue-md-loader/tree/master/example)

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

### md

Object.

Use this to replace the Markdown-It instance inside the loader. For example:

```javascript
new MarkdownIt({
  // options
})
```

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
