<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="course-title">Title</label>
      <input
        v-model="course.title"
        id="course-title"
        @input="onInput"
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
  },
  methods: {
    onInput () {
      if (this.course.title === '') {
        this.course.title = null
      }
    }
  }
}
</script>
