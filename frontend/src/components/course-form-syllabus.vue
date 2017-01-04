<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Syllabus</label>
      <RichContentEditor
        v-model="course.syllabus"
        name="course-syllabus"
      />
      <p v-if="!course.syllabus" class="warning">
        A syllabus must be defined before students can be enrolled in a course.
      </p>
    </div>
  </div>
</template>

<script>
import RichContentEditor from './rich-content-editor'

export default {
  components: {
    RichContentEditor
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  }
}
</script>
