<template>
  <div>
    <SignInEmail :credentials="credentials"/>
    <SignInPassword :credentials="credentials"/>
    <SignInButton :credentials="credentials"/>
  </div>
</template>

<script>
import SignInButton from './sign-in-button'
import SignInEmail from './sign-in-form-email'
import SignInPassword from './sign-in-form-password'

export default {
  data () {
    return {
      credentials: {
        email: '',
        password: ''
      }
    }
  },
  components: {
    SignInButton, SignInEmail, SignInPassword
  }
}
</script>
