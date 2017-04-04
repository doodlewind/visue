<template>
  <div class="editor">
    <button @click="chooseVuexModule">
      Choose Vuex Module File
    </button>
    <div v-if="actions.length">
      <h4>States</h4>
      <div v-for="state in states">
        {{state}}
      </div>
      <h4>Actions</h4>
      <div v-for="action in actions">
        {{action.name}}: {{action.start}}-{{action.end}}
      </div>
    </div>
    <br>
    <button @click="chooseComponent">
      Choose Vue Component
    </button>
    <pre>
      {{template}}
    </pre>
  </div>
</template>

<script>
const visue = window.visue

export default {
  name: 'Editor',
  data () {
    return {
      actions: [],
      states: [],
      template: ''
    }
  },
  methods: {
    chooseVuexModule () {
      visue.getModuleInfo(results => {
        if (!results) return
        this.actions = results.actions
        this.states = results.states
      })
    },
    chooseComponent () {
      visue.getTemplateInfo(result => {
        console.log(result)
        // this.template = JSON.stringify(result, null, 2)
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
