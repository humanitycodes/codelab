<template>
  <div>
    <p v-if="credentials.error" class="warning">
      Invalid Credentials
    </p>
    <div class="flex-row">
      <div class="flex-col">
        <label>Email</label>
        <input v-model="credentials.email" placeholder="you@domain.com" type="text" @keyup.enter="signIn">
      </div>
    </div>
    <div class="flex-row">
      <div class="flex-col">
        <label>Password</label>
        <input v-model="credentials.password" type="password" @keyup.enter="signIn">
      </div>
    </div>
    <button class="primary block" @click="signIn">
      Sign in
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        error: null
      }
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
