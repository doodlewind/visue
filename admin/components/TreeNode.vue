<template>
  <div v-if="!isBlankNode" class="node-wrapper">
    <div class="node-info">
      <div>
        tag: <b>{{name}}</b>
        <button v-if="name !== '#text'"
          @click="beginEdit">edit</button>
        <div v-if="hasCode && !hasValue">
          <textarea v-model="code"></textarea>
          <br>
          <button @click="cancelEdit">cancel</button>
          <button @click="confirmEdit">update</button>
        </div>
      </div>
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
  props: ['name', 'initCode', 'attrs', 'location', 'initValue'],
  data () {
    return {
      hasCode: false,
      code: this.initCode,
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
    },
    beginEdit () {
      this.hasCode = true
    },
    confirmEdit () {
      window.bus.$emit('updateNodeValue', {
        location: this.location,
        value: this.code
      })
      this.hasCode = false
    },
    cancelEdit () {
      this.hasCode = false
    }
  },
  watch: {
    initValue (newVal) {
      this.value = newVal
    },
    initCode (newVal) {
      this.code = newVal
    }
  }
}
</script>

<style lang="stylus" scoped>
.node-wrapper
  margin-top: .1rem
  border-left: lightblue 3px solid
  padding-left: .05rem
.slot-wrapper
  margin-left: .1rem
textarea
  width: 3rem
  height: 1rem
</style>
