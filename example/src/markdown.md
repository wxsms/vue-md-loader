# Hello World!

Just testing...

## Simple Code Block 1

```html
<template>
  <div>Nothing happends</div>
</template>
<style scoped>
  div {
    color: green;
  }
</style>
```

## Simple Code Block 2

```html
<div>Nothing happends, too...</div>
```

## Live 1

```html
<template>
  <div id="test-block">This is a test block! {{msg}}</div>
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
  #test-block {
    color: green;
  }
</style>
<!-- Live demo -->
```

## Live 2

```html
<template>
  <div class="cls1">{{msg}}</div>
</template>
<script>
  export default {
    data () {
      return {
        msg: 'test test test'
      }
    }
  }
</script>
<style>
  .cls1 {
    color: red;
    background: green;
  }
</style>
<!-- live demo -->
```

## Live 3

```html
<template>
  <p>count: {{count}}</p>
  <button type="button" @click="++count">+1</button>
  <button type="button" @click="--count">-1</button>
</template>
<script>
  export default {
    data () {
      return {
        count: 0
      }
    }
  }
</script>
<!-- live demo -->
```