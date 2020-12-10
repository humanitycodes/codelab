<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="course-credits">Number of Credits</label>
      <input
        ref="input"
        :value="credits"
        id="course-credits"
        name="course-credits"
        @input="updateCredits($event.target.value)"
        @change="$event.target.value = credits"
      >
      <p v-if="credits && credits > 4" class="warning">
        It's quite rare for a course to be worth more than 4 credits. Are you sure that's right?
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    credits: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateCredits (newCredits) {
      if (/^\d*$/.test(newCredits)) {
        const newCreditsNumber = Number(newCredits)
        if (!isNaN(newCreditsNumber) && newCreditsNumber > 0) {
          this.$emit('update:credits', newCreditsNumber)
        } else {
          this.$emit('update:credits', null)
        }
      } else {
        this.$refs.input.value = this.credits
      }
    }
  }
}
</script>
