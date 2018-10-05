<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-title">Title</label>
      <input
        v-model="lesson.title"
        id="lesson-title"
        @input="onInput"
        name="lesson-title"
        placeholder="A short description of the lesson in the infinitive form"
      >
      <p v-if="!lesson.title" class="warning">
        A title must be defined before a lesson can be added to a course.
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
    onInput () {
      if (this.lesson.title === '') {
        this.lesson.title = null
      }
    }
  }
}
</script>
