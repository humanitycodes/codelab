<template>
  <ul class="main-nav">
    <li v-if="!userSignedIn">
      <AuthLink provider="msu">Sign in</AuthLink>
    </li>
    <li v-if="userSignedIn && !currentUser.githubToken">
      <AuthLink provider="github">Connect GitHub</AuthLink>
    </li>
    <li v-if="userAtLeastInstructor">
      <router-link to="/lessons">
        Lessons
      </router-link>
    </li>
    <li v-if="userSignedIn">
      <router-link to="/sign-out">
        Sign out
      </router-link>
    </li>
  </ul>
</template>

<script>
import { userHelpers } from '@state/helpers'
import AuthLink from './auth-link'

export default {
  components: {
    AuthLink
  },
  computed: userHelpers
}
</script>

<style lang="stylus" scoped>
@import '../meta'

ul
  margin: 0 0 $design.layout.gutterWidth
  padding: $design.layout.gutterWidth
  background: $design.branding.muted.light.gray
  list-style-type: none
</style>
