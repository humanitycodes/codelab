<template>
  <input :value="simplifiedDate" @input="onInput" type="date">
</template>

<script>
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import isValidDate from 'date-fns/is_valid'
import formatDate from 'date-fns/format'

export default {
  props: {
    value: Number,
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
      const dateValue = new Date(value)
      if (!isValidDate(dateValue)) return
      const newDate = (
        this.atDay === 'start'
          ? startOfDay(dateValue)
          : endOfDay(dateValue)
      ).getTime()
      this.$emit('input', newDate)
    }
  }
}
</script>
