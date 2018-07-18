<template>
  <input :value="simplifiedDate" @input="onInput" type="date" :name="name">
</template>

<script>
import moment from 'moment'

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
      return moment(this.value).format('YYYY-MM-DD')
    }
  },
  methods: {
    onInput (event) {
      const { value } = event.target
      if (!value) return
      const dateNumber = (
        this.atDay === 'start'
          ? moment(value, 'YYYY-MM-DD').startOf('day')
          : moment(value, 'YYYY-MM-DD').endOf('day')
      )
      this.$emit('input', dateNumber.valueOf())
    }
  }
}
</script>
