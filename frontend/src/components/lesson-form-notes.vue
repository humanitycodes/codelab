<template>
  <div class="flex-row">
    <div class="flex-col">
      <label for="lesson-notes">Notes</label>
      <textarea
        v-model="lesson.notes"
        id="lesson-notes"
        name="lesson-notes"
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
