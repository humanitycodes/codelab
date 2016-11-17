<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Syllabus</label>
      <textarea
        v-model="course.syllabus"
        placeholder="The structure and rules of the course"
      />
      <p v-if="!course.syllabus" class="warning">
        A syllabus must be defined before students can be enrolled in a course.
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
