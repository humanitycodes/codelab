<template>
  <ul class="main-nav">
    <li v-if="!userSignedIn">
      <AuthLink provider="msu">Sign in with MSU</AuthLink>
    </li>
    <li v-if="!userSignedIn">
      <AuthLink provider="email">Sign in with Email</AuthLink>
    </li>
    <li v-if="userSignedIn && !currentUser.github">
      <AuthLink provider="github">Connect GitHub</AuthLink>
    </li>
    <li v-if="canReadAllLessons()">
      <router-link to="/lessons">
        Lessons
      </router-link>
    </li>
    <li>
      <router-link to="/courses">
        Courses
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
import {
  userGetters, lessonPermissionMethods, coursePermissionMethods
} from '@state/helpers'
import AuthLink from './auth-link'

export default {
  components: {
    AuthLink
  },
  computed: userGetters,
  methods: {
    ...lessonPermissionMethods,
    ...coursePermissionMethods
  }
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
