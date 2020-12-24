<template>
  <nav class="main-nav">
    <img
      :src="logo"
      alt="Go Home"
      class="main-nav-logo"
      @click="$router.push('/')"
    />
    <ul class="main-nav-group-left">
      <slot name="primary-list"></slot>
    </ul>
    <ul class="main-nav-group-right">
      <slot name="secondary-list"></slot>
      <li v-if="!isUserSignedIn" class="main-nav-left-separator">
        <AuthLink provider="msu">Sign in</AuthLink>
      </li>
      <li v-else><UserMenu/></li>
    </ul>
  </nav>
</template>

<script>
import { userGetters } from '@state/helpers'
import AuthLink from '@components/auth-link'
import UserMenu from '@components/user-menu'
import brand from '@env/brand'

export default {
  components: {
    AuthLink, UserMenu
  },
  computed: {
    ...userGetters,
    isSecondaryListEmpty () {
      const secondarySlot = this.$slots['secondary-list']
      return !secondarySlot || !secondarySlot.length
    },
    logo () {
      // Used this format to add other brands as else if in future
      if (brand) {
        try {
          return require(`../assets/images/${brand}-logo.png`)
        } catch (error) {
          return require('../assets/images/logo.png')
        }
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
  align-items: center
  width: 100%
  list-style-type: none
  margin: 0
  padding: 0 $design.layout.gutterWidth 0 0
  > li
    margin-right: $design.layout.gutterWidth
    white-space: nowrap
    &:last-child
      margin-right: 0
  &.main-nav-group-left
    justify-content: flex-start
  &.main-nav-group-right
    justify-content: flex-end
  &:last-child
    padding-right: 0
</style>
