<template>
  <div>
    <UserEmail :email="email" :read-only="true"/>
    <UserFullName v-on="$listeners" :full-name="fullName"/>
    <UserGithub :githubLogin="githubLogin"/>
  </div>
</template>

<script>
import UserEmail from './user-form-email'
import UserFullName from './user-form-full-name'
import UserGithub from './user-form-github'

export default {
  components: {
    UserEmail, UserFullName, UserGithub
  },
  props: {
    email: String,
    fullName: String,
    githubLogin: String
  }
}
</script>
