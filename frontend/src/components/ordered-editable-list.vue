<template>
  <ol v-if="items.length">
    <Draggable :list="items" @end="items.updateOrder">
      <li v-for="item in items" :key="item['.key']">
        <div :class="inputWrapperClass">
          <div class="ordered-editable-list-input-group">
            <slot :item="item"/>
          </div>
          <button @click="removeItem(item)" class="danger">X</button>
        </div>
      </li>
    </Draggable>
  </ol>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    inputCount () {
      return this.$scopedSlots.default({ item: {} }).length
    },
    inputWrapperClass () {
      return this.inputCount === 1
        ? 'ordered-editable-list-single-input'
        : 'ordered-editable-list-multi-input'
    }
  },
  methods: {
    removeItem (item) {
      this.items.remove(item['.key'])
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

ol
  margin-top: $design.layout.gutterWidth * .5
  margin-left: $design.layout.gutterWidth
  padding-left: 0

li
  line-height: $design.control.height
  padding-left: $design.layout.gutterWidth * .5
  margin-bottom: $design.layout.gutterWidth * .5
  cursor: move
  > div
    display: inline-flex
    vertical-align: top
    width: 100%

.ordered-editable-list-single-input
  .ordered-editable-list-input-group
    margin-right: $design.layout.gutterWidth * .5
    flex-grow: 1
.ordered-editable-list-multi-input
  flex-direction: column
  .ordered-editable-list-input-group
    > input, button
      margin-bottom: $design.layout.gutterWidth * .5
</style>
