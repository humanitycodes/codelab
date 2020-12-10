<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-estimated-hours">Estimated Hours</label>
      <input
        ref="input"
        :value="estimatedHours"
        @input="updateHours($event.target.value)"
        @change="$event.target.value = estimatedHours"
        id="lesson-estimated-hours"
        name="lesson-estimated-hours"
        placeholder="Estimated hours to complete the lesson"
      >
      <p v-if="estimatedHours && estimatedHours > 3" class="warning">
        That's a pretty complex lesson. If possible, it would be good to break it up.
      </p>
      <p v-if="!estimatedHours" class="warning">
        Estimated hours must be defined before a lesson can be added to a course.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    estimatedHours: Number
  },
  methods: {
    updateHours (newHours) {
      if (/^[\d]*$/.test(newHours)) {
        const newHoursNumber = parseInt(newHours)
        if (!isNaN(newHoursNumber) && newHoursNumber > 0) {
          this.$emit('update:estimatedHours', newHoursNumber)
        } else {
          this.$emit('update:estimatedHours', null)
        }
      } else {
        this.$refs.input.value = this.estimatedHours
      }
    }
  }
}
</script>
