<template>
  <div class="form-row">
    <div class="form-group">
      <label>Notes</label>
      <textarea
        v-model="lesson.notes"
        placeholder="Additional notes for future instructors"
      />
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
