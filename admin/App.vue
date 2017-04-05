<template>
  <div id="main">
    <editor/>
  </div>
</template>

<script>
import Vue from 'vue'
import Editor from 'components/Editor'

// init global event bus
window.bus = new Vue()

export default {
  name: 'App',
  components: {
    Editor
  }
}
</script>

<style lang="stylus">
@import "~styl/mixins"

base-style()

#main
  margin: .1rem
</style>
