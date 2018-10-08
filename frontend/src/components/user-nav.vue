<template>
  <nav class="main-nav">
    <img
      :src="getLogo()"
      alt="Go Home"
      class="main-nav-logo"
      @click="$router.push('/')"
    />
    <ul class="main-nav-group-left">
      <slot name="primary-list"></slot>
    </ul>
    <ul class="main-nav-group-right">
      <slot name="secondary-list"></slot>
      <li v-if="!isSecondaryListEmpty" class="main-nav-separator"/>
      <li v-if="!isUserSignedIn">
        <AuthLink provider="msu">Sign in</AuthLink>
      </li>
      <li v-if="isUserSignedIn && hasNewGitHubScopes">
        <AuthLink provider="github">
          {{ currentUser.githubLogin ? 'Reconnect GitHub' : 'Connect GitHub' }}
        </AuthLink>
      </li>
      <li v-if="isUserSignedIn" class="main-nav-user-name">
        {{ currentUser.fullName }}
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
  userGetters, userPermissionMethods, lessonPermissionMethods, coursePermissionMethods
} from '@state/helpers'
import AuthLink from '@components/auth-link'

export default {
  components: {
    AuthLink
  },
  computed: {
    ...userGetters,
    isSecondaryListEmpty () {
      const secondarySlot = this.$slots['secondary-list']
      return !secondarySlot || !secondarySlot.length
    }
  },
  methods: {
    ...userPermissionMethods,
    ...lessonPermissionMethods,
    ...coursePermissionMethods,
    getLogo () {
      // Used this format to add other brands as else if in future
      const brand = process.env.CODELAB_BRAND || 'msu'
      if (brand === 'codelab517') {
        return require('../assets/images/logo-blue.png')
      } else {
        return require('../assets/images/logo.png')
      }
    }
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
    &.main-nav-separator
      border-right: 1px solid $design.control.border.color
      padding: 0
      margin-right: $design.layout.gutterWidth
    >
      a
  &.main-nav-group-left
    justify-content: flex-start
  &.main-nav-group-right
    justify-content: flex-end
  &:last-child
    padding-right: 0
</style>
