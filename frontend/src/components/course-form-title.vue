<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Title</label>
      <input
        v-model="course.title"
        name="course-title"
        placeholder="A short description of the course in the infinitive form"
      >
      <p v-if="!course.title" class="warning">
        A title must be defined before students can be enrolled in a course.
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
  }
}
</script>
