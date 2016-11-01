<template>
  <span class="dropdown-wrapper" :class="{ expanded: results.length }">
    <slot/>
    <div class="dropdown-results" v-show="results.length">
      <div
        v-for="result in results"
        @click="resultHandler(result)"
        class="dropdown-result"
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

.dropdown-result
  padding: $design.control.padding.vertical $design.control.padding.horizontal
  cursor: pointer
  &:hover
    background-color: $design.branding.primary.light
    color: white
</style>
