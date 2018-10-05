<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-notes">Notes</label>
      <textarea
        v-model="lesson.notes"
        @input="onInput"
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
  },
  methods: {
    onInput () {
      if (this.lesson.notes === '') {
        this.lesson.notes = null
      }
    }
  }
}
</script>
