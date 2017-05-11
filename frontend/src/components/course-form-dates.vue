<template>
  <div>
    <div class="flex-row">
      <div class="flex-col">
        <label for="course-start-date">Start Date</label>
        <DatePicker v-model="course.startDate" id="course-start-date" name="course-start-date"/>
      </div>
      <div class="flex-col">
        <label for="course-end-date">End Date</label>
        <DatePicker v-model="course.endDate" at-day="end" id="course-end-date" name="course-end-date"/>
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
