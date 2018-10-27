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
