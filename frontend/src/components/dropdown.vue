<template>
  <span
    class="dropdown-wrapper"
    :class="{ expanded: results.length }"
    @keydown.up="focusedResultIndex > 0 && focusedResultIndex--"
    @keydown.down="focusedResultIndex < results.length - 1 && focusedResultIndex++"
    @keydown.enter="resultHandler(results[focusedResultIndex])"
  >
    <slot/>
    <div class="dropdown-results" v-show="results.length">
      <div
        v-for="(result, index) in results"
        :key="index"
        @click="resultHandler(result)"
        @mouseenter="focusedResultIndex = index"
        class="dropdown-result"
        :class="{ focused: focusedResultIndex === index }"
      >
        {{ resultContent(result) }}
      </div>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    results: {
      type: Array,
      required: true
    },
    resultHandler: {
      type: Function,
      required: true
    },
    resultContent: {
      type: Function,
      default: result => result
    }
  },
  data () {
    return {
      focusedResultIndex: 0
    }
  },
  watch: {
    results () {
      this.focusedResultIndex = 0
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.dropdown-wrapper
  position: relative

  &.expanded input
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    border-bottom-color: lighten($design.branding.primary.light, 80%)

.dropdown-results
  position: absolute
  width: 100%
  left: 0
  top: calc(100% + $design.control.padding.vertical)
  background-color: $design.branding.muted.light.tan
  border: 1px solid $design.branding.primary.light
  border-top: none
  border-bottom-left-radius: $design.control.border.radius
  border-bottom-right-radius: $design.control.border.radius
  z-index: 1

.dropdown-result
  padding: $design.control.padding.vertical $design.control.padding.horizontal
  cursor: pointer
  &.focused
    background-color: $design.branding.primary.light
    color: white
</style>
