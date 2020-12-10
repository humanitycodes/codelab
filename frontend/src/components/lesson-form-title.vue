<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-title">Title</label>
      <input
        :value="title"
        id="lesson-title"
        @input="onInput"
        name="lesson-title"
        placeholder="A short description of the lesson in the infinitive form"
      >
      <p v-if="!title" class="warning">
        A title must be defined before a lesson can be added to a course.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  methods: {
    onInput (event) {
      this.$emit('update:title', event.target.value || null)
    }
  }
}
</script>
