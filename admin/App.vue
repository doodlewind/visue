<template>
  <div id="main">
    <editor/>
  </div>
</template>

<script>
import Editor from 'components/Editor'

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
