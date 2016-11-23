<template>
  <div>
    <p v-if="credentials.error" class="warning">
      Invalid Credentials
    </p>
    <SignInEmail :credentials="credentials"/>
    <SignInPassword :credentials="credentials"/>
    <SignInButton :credentials="credentials"/>
  </div>
</template>

<script>
import SignInEmail from './sign-in-form-email'
import SignInPassword from './sign-in-form-password'
import SignInButton from './sign-in-button'

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
  components: {
    SignInEmail, SignInPassword, SignInButton
  }
}
</script>
