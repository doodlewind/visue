<template>
  <div class="editor">
    <button @click="chooseFile">
      Choose Vuex Module File
    </button>
    <div>
      <h4 v-if="actions.length">Actions</h4>
      <div v-for="action in actions">
        {{action.name}}: {{action.start}}-{{action.end}}
      </div>
    </div>
  </div>
</template>

<script>
const visue = window.visue

export default {
  name: 'Editor',
  data () {
    return {
      actions: []
    }
  },
  methods: {
    chooseFile () {
      visue.getActions(results => {
        if (!results) return
        this.actions = results.actions
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~styl/mixins"

.editor
  color: color-main
</style>
