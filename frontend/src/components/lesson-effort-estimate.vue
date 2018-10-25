<template>
  <div
    v-if="estimatedEffort"
    :title="
      'This lesson is likely to take a ' +
      estimatedEffort.full +
      ' amount of time to complete.'
    "
  >
    <span class="fas fa-tshirt"/>
    {{ estimatedEffort.abbreviation }}
  </div>
</template>

<script>
const estimateMap = {
  1: {
    abbreviation: 'S',
    full: 'small'
  },
  2: {
    abbreviation: 'M',
    full: 'medium'
  },
  3: {
    abbreviation: 'L',
    full: 'large'
  }
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
