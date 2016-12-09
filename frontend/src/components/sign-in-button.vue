<template>
  <button class="primary block" @click="signIn">
    Sign in
  </button>
</template>

<script>
export default {
  props: {
    credentials: {
      type: Object,
      required: true
    }
  },
  methods: {
    signIn () {
      this.$store.dispatch('signIn', this.credentials)
      .then(authUser => { window.location = '/' })
      .catch(error => {
        this.credentials.error = error
      })
    }
  }
}
</script>
