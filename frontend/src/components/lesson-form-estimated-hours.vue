<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Estimated Hours</label>
      <input
        ref="input"
        :value="lesson.estimatedHours"
        @input="updateHours($event.target.value)"
        @change="$event.target.value = lesson.estimatedHours"
        name="lesson-estimated-hours"
        placeholder="Estimated hours to complete the lesson"
      >
      <p v-if="lesson.estimatedHours && lesson.estimatedHours > 3" class="warning">
        That's a pretty complex lesson. If possible, it would be good to break it up.
      </p>
      <p v-if="!lesson.estimatedHours" class="warning">
        Estimated hours must be defined before a lesson can be added to a course.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateHours (newHours) {
      if (/^[\d.]*$/.test(newHours)) {
        const newHoursNumber = Number(newHours)
        if (!isNaN(newHoursNumber) && newHoursNumber > 0) {
          this.lesson.estimatedHours = newHoursNumber
        }
      } else {
        this.$refs.input.value = this.lesson.estimatedHours
      }
    }
  }
}
</script>
