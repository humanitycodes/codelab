<template>
  <span
    aria-hidden="true"
    class="fa order-by-indicator"
    :class="{
      'fa-chevron-circle-down': column === orderByColumn,
      'fa-flip-vertical': orderByDirection === 'desc'
    }"
  ></span>
</template>

<script>
export default {
  props: {
    column: {
      type: String,
      required: true
    },
    orderByColumn: {
      type: String,
      required: true
    },
    orderByDirection: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus">
.order-by-indicator
  font-size: 1em !important
  width: .5em
</style>
