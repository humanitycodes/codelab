<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-content">Content</label>
      <RichContentEditor
        :value="content"
        @input="$emit('update:content', $event)"
        id="lesson-content"
        name="lesson-content"
      />
      <p v-if="!content" class="warning">
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
    content: String
  }
}
</script>
