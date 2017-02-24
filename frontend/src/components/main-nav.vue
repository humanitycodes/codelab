<template>
  <nav class="main-nav">
    <img
      src="../assets/images/logo.png"
      alt="Logo"
      class="main-nav-logo"
      @click="$router.push('/')"
    />
    <ul class="main-nav-group-left">
      <li v-if="canReadAllCourses()">
        <router-link to="/code-reviews">
          Code Reviews
        </router-link>
      </li>
      <li v-if="canReadAllCourses()">
        <router-link to="/student-progress">
          Student Progress
        </router-link>
      </li>
      <li v-if="isUserSignedIn">
        <router-link to="/courses">
          Courses
        </router-link>
      </li>
      <li v-if="canReadAllLessons()">
        <router-link to="/lessons">
          Lessons
        </router-link>
      </li>
    </ul>
    <ul class="main-nav-group-right">
      <li v-if="!isUserSignedIn">
        <AuthLink provider="msu">Sign in</AuthLink>
      </li>
      <!-- Katie can manually set this to display: block for now -->
      <li v-if="!isUserSignedIn" v-show="false">
        <router-link to="/email-sign-in">Sign in with Email</AuthLink>
      </li>
      <li v-if="isUserSignedIn && hasNewGitHubScopes">
        <AuthLink provider="github">
          {{ currentUser.profile.github ? 'Reconnect GitHub' : 'Connect GitHub' }}
        </AuthLink>
      </li>
      <li v-if="isUserSignedIn">
        {{ currentUser.profile.fullName }}
      </li>
      <li v-if="isUserSignedIn">
        <router-link to="/sign-out">
          Sign out
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import {
  userGetters, lessonPermissionMethods, coursePermissionMethods
} from '@state/helpers'
import AuthLink from '@components/auth-link'

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

.main-nav
  display: flex
  align-items: center
  margin: 0 0 $design.layout.gutterWidth
  padding: $design.layout.gutterWidth
  background: $design.branding.default.light
  border-bottom: 1px solid darken($design.branding.muted.light.gray, 10%)

.main-nav-logo
  width: 2em
  height: 2em
  margin-right: $design.layout.gutterWidth
  cursor: pointer

ul
  display: flex
  width: 100%
  list-style-type: none
  margin: 0
  padding: 0 $design.layout.gutterWidth 0 0
  > li
    padding-right: $design.layout.gutterWidth
    white-space: nowrap
    &:last-child
      padding-right: 0
    >
      a
  &.main-nav-group-left
    justify-content: flex-start
  &.main-nav-group-right
    justify-content: flex-end
  &:last-child
    padding-right: 0
</style>
