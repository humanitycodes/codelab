<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="course-title">Title</label>
      <input
        :value="title"
        id="course-title"
        @input="onInput"
        name="course-title"
        placeholder="A short description of the course in the infinitive form"
      >
      <p v-if="!title" class="warning">
        A title must be defined before students can be enrolled in a course.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    onInput (event) {
      this.$emit('update:title', event.target.value || null)
    }
  }
}
</script>
