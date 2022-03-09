<template>
  <Layout>
    <h1>New Instructor</h1>
    <UserEmail v-bind:email.sync="user.email"/>
    <p v-if="isEmailInUse" class="error">
      An account with this email address already exists.
    </p>
    <UserFullName v-bind:full-name.sync="user.fullName"/>
    <button
      :disabled="!formIsValid"
      @click="tryToCreateInstructor"
      class="primary block"
    >
      Create instructor
    </button>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import { userGetters } from '@state/helpers'
import UserEmail from '../components/user-form-email'
import UserFullName from '../components/user-form-full-name'
import isEmailAddress from '@helpers/utils/is-email-address'

export default {
  components: {
    Layout, UserEmail, UserFullName
  },
  data () {
    return {
      user: {
        email: '',
        fullName: '',
        isInstructor: true
      }
    }
  },
  computed: {
    ...userGetters,
    isEmailInUse () {
      if (!this.isValidEmail) return false
      const email = this.user.email.trim().toLowerCase()
      return this.users.some(user => user.email === email)
    },
    isValidEmail () {
      return isEmailAddress(this.user.email)
    },
    isValidName () {
      return this.user.fullName && this.user.fullName.trim().length
    },
    formIsValid () {
      return this.isValidName && this.isValidEmail && !this.isEmailInUse
    }
  },
  methods: {
    tryToCreateInstructor () {
      if (this.formIsValid) {
        this.$router.replace('/instructors')
      }
    }
  }
}
</script>
