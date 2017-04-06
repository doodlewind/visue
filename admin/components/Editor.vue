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
      <div v-for="(action, i) in actions">
        {{action.name}}
        <button @click="action.open = !action.open">
          toggle
        </button>
        <br>
        <pre v-show="action.open">{{action.code}}</pre>
      </div>
    </div>
    <br>
    <button @click="chooseComponent">
      Choose Vue Component
    </button>
    <tree-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeNode from './TreeNode'

const visue = window.visue

function isLeaf (node) {
  return node.childNodes && node.childNodes.length
}

function getLeafProps (node) {
  return {
    name: node.nodeName,
    attrs: node.attrs,
    initValue: node.value,
    initCode: visue.getTemplateCode(node.location),
    location: node.location
  }
}

function getNodes (nodes, createElement) {
  return nodes.map(node => {
    return createElement(
      // node type, supports Vue component or string
      TreeNode,
      // node props args, support vue args object
      { props: getLeafProps(node) },
      // node children, support array or string
      // pass in child tree nodes via slot
      isLeaf(node)
        ? getNodes(node.childNodes, createElement)
        : ''
    )
  })
}

export default {
  name: 'Editor',
  created () {
    window.bus.$on('updateNodeValue', payload => {
      this.templateNodes = visue.updateNodeValue(payload).childNodes
    })
    const vm = this
    Vue.component('TreeView', {
      render (createElement) {
        return createElement(
          'div',
          getNodes(vm.templateNodes, createElement)
        )
      }
    })
  },
  data () {
    return {
      actions: [],
      states: [],
      templateNodes: []
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
        if (!result) return
        this.templateNodes = result.childNodes
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~styl/mixins"

.editor
  color: color-main
pre
  font-size: .12rem
</style>
