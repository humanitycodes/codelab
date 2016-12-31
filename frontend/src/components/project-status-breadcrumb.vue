<template>
  <div
    class="flex-col project-status-breadcrumb"
    :class="{
      active: isActive,
      complete: isComplete
    }"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    isComplete: {
      type: Boolean,
      required: true
    },
    pendingText: {
      type: String,
      required: true
    },
    activeText: {
      type: String,
      required: true
    },
    completeText: {
      type: String,
      required: true
    }
  },
  computed: {
    text () {
      return this.isActive
        ? this.activeText
        : this.isComplete
          ? this.completeText
          : this.pendingText
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

$breadcrumb-padding-horizontal = $design.control.height * .4
$breadcrumb-arrow-width = $breadcrumb-padding-horizontal
$breadcrumb-arrow-half-height = $design.control.height * .5
$breadcrumb-active-bg = #FFF

.project-status-breadcrumb
  height: $design.control.height
  padding: 0 $breadcrumb-padding-horizontal 0 $breadcrumb-padding-horizontal * 2
  background-color: $design.branding.muted.light.gray
  color: lighten($design.body.text.color, 30%)
  text-align: center
  font-size: 11px
  font-weight: 600
  line-height: $design.control.height
  letter-spacing: .1rem
  text-transform: uppercase
  text-decoration: none
  white-space: nowrap
  border-top: 1px solid $design.control.border.color
  border-bottom: 1px solid $design.control.border.color
  margin: 0
  margin-right: -1px
  position: relative
  &:before, &:after
    content: ''
    position: absolute
    width: 0
    top: -1px
    border-width: $breadcrumb-arrow-half-height 0 $breadcrumb-arrow-half-height $breadcrumb-arrow-width
    border-style: solid
    z-index: 1
  &:before
    right: $breadcrumb-arrow-width * -1 + 1px
    border-color: transparent $design.control.border.color
  &:after
    right: $breadcrumb-arrow-width * -1 + 2px
    border-color: transparent $design.branding.muted.light.gray
  &.active
    background-color: $breadcrumb-active-bg
    color: $design.body.text.color
    border-bottom: none
    &:after
      border-color: transparent $breadcrumb-active-bg
  &.complete
    background-color: $design.branding.muted.light.success
    margin-bottom: 0
    &:after
      border-color: transparent $design.branding.muted.light.success
  &:first-child
    padding-left: $breadcrumb-padding-horizontal
    border-left: 1px solid $design.control.border.color
  &:last-child
    border-right: 1px solid $design.control.border.color
    &:before, &:after
      display: none
</style>