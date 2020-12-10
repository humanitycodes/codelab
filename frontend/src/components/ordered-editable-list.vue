<template>
  <ol v-if="items.length">
    <Draggable :list="orderedItems" @end="updatePositions(orderedItems)">
      <li v-for="item in orderedItems" :key="item.position">
        <div :class="inputWrapperClass">
          <div class="ordered-editable-list-input-group">
            <slot :item="item"/>
          </div>
          <button @click="removeItem(item.position)" class="danger">×</button>
        </div>
      </li>
    </Draggable>
  </ol>
</template>

<script>
import Draggable from 'vuedraggable'
import orderBy from 'lodash/orderBy'
import deepCopy from '@helpers/utils/deep-copy'
import removeArrayIndex from '@helpers/utils/remove-array-index'

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
    },
    orderedItems () {
      return orderBy(this.items, [item => item.position])
    }
  },
  methods: {
    removeItem (position) {
      const index = this.items.findIndex(item => item.position === position)
      const modifiedItems = removeArrayIndex(this.items, index)
      this.updatePositions(modifiedItems)
    },
    updatePositions (modifiedItems) {
      const items = deepCopy(modifiedItems)
      items.forEach((item, index) => {
        item.position = index
      })
      this.$emit('update:items', items)
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
