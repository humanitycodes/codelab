<template>
  <div>
    <p v-if="credentials.error" class="warning">
      Invalid Credentials
    </p>
    <div class="stretch-row">
      <div class="stretch-col">
        <label for="email">Email</label>
        <input v-model="credentials.email" id="email" placeholder="you@domain.com" type="text" @keyup.enter="signIn">
      </div>
    </div>
    <div class="stretch-row">
      <div class="stretch-col">
        <label for="password">Password</label>
        <input v-model="credentials.password" id="password" type="password" @keyup.enter="signIn">
      </div>
    </div>
    <button class="primary block" @click="signIn">
      Sign in
    </button>
  </div>
</template>

<script>
import store from '@state/store'

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
      store.dispatch('signIn', this.credentials)
      .then(authUser => { window.location = '/' })
      .catch(error => {
        this.credentials.error = error
      })
    }
  }
}
</script>
