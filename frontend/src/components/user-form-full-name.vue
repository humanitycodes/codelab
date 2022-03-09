
<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="user-full-name">Name</label>
      <input
        :value="fullName"
        id="user-full-name"
        @input="onInput"
        name="user-full-name"
        placeholder="First and last name"
      >
      <p v-if="!isValidName" class="warning">
        A name is required so other people know what to call you.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fullName: String
  },
  computed: {
    isValidName () {
      return this.fullName && this.fullName.trim().length
    }
  },
  methods: {
    onInput (event) {
      this.$emit('update:fullName', event.target.value || null)
    }
  }
}
</script>
