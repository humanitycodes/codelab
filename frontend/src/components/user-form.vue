<template>
  <div>
    <UserEmail :email="email"/>
    <UserFullName v-on="$listeners" :full-name="fullName"/>
  </div>
</template>

<script>
import UserEmail from './user-form-email'
import UserFullName from './user-form-full-name'

export default {
  components: {
    UserEmail, UserFullName
  },
  props: {
    email: String,
    fullName: String
  }
}
</script>
