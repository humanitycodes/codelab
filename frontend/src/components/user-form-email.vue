
<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="user-email">Email</label>
      <input
        :value="email"
        id="user-email"
        @input="onInput"
        name="user-email"
        :title="readOnly ? 'Email address cannot be changed' : ''"
        :readonly="readOnly"
        :aria-readonly="readOnly"
        :disabled="readOnly"
        :aria-disabled="readOnly"
      >
      <p v-if="!isValidEmail" class="warning">
        An email is required to sign in.
      </p>
    </div>
  </div>
</template>

<script>
import isEmailAddress from '@helpers/utils/is-email-address'

export default {
  props: {
    email: String,
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isValidEmail () {
      return isEmailAddress(this.email)
    }
  },
  methods: {
    onInput (event) {
      this.$emit('update:email', event.target.value || null)
    }
  }
}
</script>
