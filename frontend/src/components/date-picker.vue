<template>
  <input :value="simplifiedDate" @input="onInput" type="date">
</template>

<script>
import { startOfDay, endOfDay, format as formatDate } from 'date-fns'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    atDay: {
      type: String,
      default: 'start'
    }
  },
  computed: {
    simplifiedDate () {
      if (!this.value) return ''
      return formatDate(this.value, 'YYYY-MM-DD')
    }
  },
  methods: {
    onInput (event) {
      const { value } = event.target
      const newDate = (
        this.atDay === 'start'
          ? startOfDay(value)
          : endOfDay(value)
      ).toString()
      this.$emit('input', newDate === 'Invalid Date' ? '' : newDate)
    }
  }
}
</script>
