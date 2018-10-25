<template>
  <div v-if="effort > 0">
    <span class="far fa-clock-o"/>
    {{ effort }}
  </div>
</template>

<script>
export default {
  props: {
    effort: {
      type: Number,
      required: true
    }
  }
}
</script>
