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

## Markdown Alive!

A live demo is :

```markdown
You markdown with some Vue code blocks that wanted to showcase...
```

becomes something like:

```html
<Markdown>
  ...
  <Live0></Live0>
  ...
  <Live1></Live1>
  ...
</Markdown>
```

with all the things settled for you!

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
              // You prefer options
            }
          }
        ]
      }
    ]
  }
}
```

## Options

Coming soon...
