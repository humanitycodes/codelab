<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="course-syllabus">Syllabus</label>
      <RichContentEditor
        :value="syllabus"
        @input="$emit('update:syllabus', $event)"
        id="course-syllabus"
        name="course-syllabus"
      />
      <p v-if="!syllabus" class="warning">
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
    syllabus: {
      type: String,
      required: true
    }
  }
}
</script>
