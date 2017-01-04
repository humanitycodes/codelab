<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Content</label>
      <RichContentEditor
        v-model="lesson.content"
        name="lesson-content"
      />
      <p v-if="!lesson.content" class="warning">
        A lesson must have content before being added to a course.
      </p>
    </div>
  </div>
</template>

<script>
import '@assets/css/codemirror-theme-one-dark.css'
import RichContentEditor from './rich-content-editor'

export default {
  components: {
    RichContentEditor
  },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  }
}
</script>
