<template>
  <div class="flex-row">
    <div class="flex-col">
      <label for="course-credits">Number of Credits</label>
      <input
        ref="input"
        :value="course.credits"
        id="course-credits"
        name="course-credits"
        @input="updateCredits($event.target.value)"
        @change="$event.target.value = course.credits"
      >
      <p v-if="course.credits && course.credits > 4" class="warning">
        It's quite rare for a course to be worth more than 4 credits. Are you sure that's right?
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateCredits (newCredits) {
      if (/^\d*$/.test(newCredits)) {
        const newCreditsNumber = Number(newCredits)
        if (!isNaN(newCreditsNumber) && newCreditsNumber > 0) {
          this.course.credits = newCreditsNumber
        }
      } else {
        this.$refs.input.value = this.course.credits
      }
    }
  }
}
</script>
