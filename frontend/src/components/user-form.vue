<template>
  <div>
    <UserFullName v-on="$listeners" :full-name="fullName"/>
  </div>
</template>

<script>
import UserFullName from './user-form-full-name'

export default {
  components: {
    UserFullName
  },
  props: {
    fullName: String
  }
}
</script>
