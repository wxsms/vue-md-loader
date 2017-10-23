<template>
  <div id="app">
    <markdown></markdown>
  </div>
</template>

<script>
  import Markdown from './markdown.md'
  import 'highlight.js/styles/github-gist.css'

  export default {
    components: {Markdown}
  }
</script>

<style>

</style>