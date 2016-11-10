<template>
  <div>
    <div class="form-row">
      <div class="form-group">
        <label>Start Date</label>
        <DatePicker v-model="course.startDate"/>
      </div>
      <div class="form-group">
        <label>End Date</label>
        <DatePicker v-model="course.endDate" at-day="end"/>
      </div>
    </div>
    <p v-if="warning" class="warning">
      {{ warning }}
    </p>
  </div>
</template>

<script>
import DatePicker from './date-picker'

export default {
  components: {
    DatePicker
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    warning () {
      if (!this.course.startDate || !this.course.endDate) {
        return 'Both the start date and end date must be entered before students can be enrolled in a course.'
      }
      const startDate = Date.parse(this.course.startDate)
      const endDate = Date.parse(this.course.endDate)
      if (startDate >= endDate) {
        return 'The end date must come after the start date.'
      }
      return ''
    }
  }
}
</script>
