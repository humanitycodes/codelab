<template>
  <button class="primary block" @click="signIn">
    Sign in
  </button>
</template>

<script>
import firebase from 'firebase'

export default {
  props: {
    credentials: {
      type: Object,
      required: true
    }
  },
  methods: {
    signIn () {
      firebase.auth().signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
      .then(user => user.getToken())
      .then(token => {
        console.log('token', token)
      })
      .catch(error => {
        this.credentials.error = error
      })
    }
  }
}
</script>
