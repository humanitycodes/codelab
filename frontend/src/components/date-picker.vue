<template>
  <input :value="simplifiedDate" @input="onInput" type="date" :name="name">
</template>

<script>
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import formatDate from 'date-fns/format'

export default {
  props: {
    value: Number,
    atDay: {
      type: String,
      default: 'start'
    },
    name: String
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
      if (!value) return
      const dateNumber = (
        this.atDay === 'start'
          ? startOfDay(value)
          : endOfDay(value)
      ).getTime()
      this.$emit('input', dateNumber)
    }
  }
}
</script>
