<template>
  <button
    name="done-button"
    class="primary block"
    @click="$emit('click')"
  >
    <span v-if="!useSaveText">My work here is done</span>
    <span v-else>Save</span>
  </button>
</template>

<script>
export default {
  data () {
    return {
      useSaveText: this.saveBtn
    }
  },
  props: {
    saveBtn: {
      type: Boolean,
      default: false
    }
  }
}
</script>
