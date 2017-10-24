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

## Live 0

A live block without scripts & styles.

```html
<template>
  <div>This <template>is</template> a Live block!</div>
</template>
<!-- live-0.vue -->
```

## Live 1

A Vue live block with template & script & style.

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
<!-- live-1.vue -->
```

## Live 2

Another Vue live block with same data as `Live 1`.

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
<!-- live-2.vue -->
```

## Live 3

Live block with methods.

```html
<template>
  <p>count: {{count}}</p>
  <button type="button" @click="add">+1</button>
  <button type="button" @click="minus">-1</button>
</template>
<script>
  export default {
    data () {
      return {
        count: 0
      }
    },
    methods: {
      add () {
        this.count++ 
      },
      minus () {
        this.count--
      }
    }
  }
</script>
<!-- live-3.vue -->
```
