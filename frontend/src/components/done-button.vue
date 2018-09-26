<template>
  <button
    name="done-button"
    class="primary block"
    @click="$emit('click')"
  >
    <span v-if="!saveButton">My work here is done</span>
    <span v-else>Save</span>
  </button>
</template>

<script>
export default {
  props: {
    saveButton: {
      type: Boolean,
      default: false
    }
  }
}
</script>
