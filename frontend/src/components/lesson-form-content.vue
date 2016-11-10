<template>
  <div class="form-row">
    <div class="form-group">
      <label>Content</label>
      <textarea
        v-model="lesson.content"
        placeholder="Markdown explaining the lesson content"
      />
      <p v-if="!lesson.content" class="warning">
        A lesson must have content before being added to a course.
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
