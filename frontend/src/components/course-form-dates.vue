<template>
  <div>
    <div class="stretch-row">
      <div class="stretch-col">
        <label for="course-start-date">Start Date</label>
        <DatePicker
          :value="startDate"
          @input="$emit('update:startDate', $event)"
          id="course-start-date"
          name="course-start-date"
        />
      </div>
      <div class="stretch-col">
        <label for="course-end-date">End Date</label>
        <DatePicker
          :value="endDate"
          @input="$emit('update:endDate', $event)"
          at-day="end"
          id="course-end-date"
          name="course-end-date"
        />
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
    startDate: {
      type: Number,
      required: true
    },
    endDate: {
      type: Number,
      required: true
    }
  },
  computed: {
    warning () {
      if (!this.startDate || !this.endDate) {
        return 'Both the start date and end date must be entered before students can be enrolled in a course.'
      }
      if (this.startDate >= this.endDate) {
        return 'The end date must come after the start date.'
      }
      return ''
    }
  }
}
</script>
