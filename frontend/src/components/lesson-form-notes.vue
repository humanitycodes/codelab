<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-notes">Notes</label>
      <textarea
        :value="notes"
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
    notes: String
  },
  methods: {
    onInput (event) {
      this.$emit('update:notes', event.target.value || null)
    }
  }
}
</script>
