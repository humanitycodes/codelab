<template>
  <div v-if="estimatedEffort">
    <span class="fas fa-tshirt"/>
    {{ estimatedEffort }}
  </div>
</template>

<script>
const estimateMap = {
  1: 'S',
  2: 'M',
  3: 'L'
}

export default {
  props: {
    effort: {
      type: Number,
      required: true
    }
  },
  computed: {
    estimatedEffort () {
      return estimateMap[this.effort]
    }
  }
}
</script>
