<template>
  <div class="flex-row">
    <div class="flex-col">
      <label for="lesson-title">Title</label>
      <input
        v-model="lesson.title"
        id="lesson-title"
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
  }
}
</script>
