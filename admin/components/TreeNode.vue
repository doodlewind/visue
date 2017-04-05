<template>
  <div v-if="!isBlankNode" class="node-wrapper">
    <div class="node-info">
      <div>tag: <b>{{name}}</b></div>
      <div v-if="nodeClass">
        class: <b>{{nodeClass}}</b>
      </div>
      <div v-if="hasValue">
        value:
        <input v-model="value">
        <button @click="update">update</button>
      </div>
    </div>
    <div class="slot-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',
  props: ['name', 'attrs', 'location', 'initValue'],
  data () {
    return {
      value: this.initValue
    }
  },
  computed: {
    isBlankNode () {
      return this.name === '#text' &&
        this.initValue.replace(/\s/g, '') === ''
    },
    hasValue () {
      let trimmedValue = this.initValue
        ? this.initValue.replace(/\s/g, '')
        : false
      return trimmedValue && trimmedValue.length
    },
    nodeClass () {
      let classAttr = this.attrs.filter(a => a.name === 'class')
      if (!classAttr.length) return null
      return classAttr[0].value
    }
  },
  methods: {
    update () {
      window.bus.$emit('updateNodeValue', {
        location: this.location,
        value: this.value
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.node-wrapper
  margin-top: .1rem
  border-left: lightblue 3px solid
.slot-wrapper
  margin-left: .1rem
</style>
