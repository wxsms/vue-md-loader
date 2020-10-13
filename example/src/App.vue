<template>
  <div id="app">
    <header class="page-header" role="banner">
      <h1 class="project-name">vue-md-loader</h1>
      <h2 class="project-tagline">Webpack loader for converting Markdown files to ✨ALIVE Vue components.</h2>
      <a href="https://github.com/wxsms/vue-md-loader" class="btn">View on GitHub</a>
      <a href="https://github.com/wxsms/vue-md-loader/blob/master/example/src/markdown.md" class="btn">Source of this page</a>
    </header>
    <main id="content" class="main-content" role="main">
      <markdown />
      <footer class="site-footer">
        <span class="site-footer-owner"><a href="https://github.com/wxsms/vue-md-loader">vue-md-loader</a> is maintained by <a href="https://github.com/wxsms">@wxsms</a>.</span>
        <span class="site-footer-credits">Theme by <a href="https://github.com/pages-themes/cayman">cayman</a>.</span>
      </footer>
    </main>
  </div>
</template>

<script>
import Markdown from './markdown.md'
import 'highlight.js/styles/github-gist.css'

export default {
  components: { Markdown }
}
</script>
