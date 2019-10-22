<template>
  <div id="app">
    <markdown />
  </div>
</template>

<script>
import Markdown from './markdown.md'
import 'highlight.js/styles/github-gist.css'

export default {
  components: { Markdown }
}
</script>

<style>
  .live-wrapper {
    background: #eee;
    padding: 10px;
  }
</style>
