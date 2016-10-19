<template>
  <ul class="main-nav">
    <li>
      <AuthLink provider="msu">Sign up</AuthLink>
      with your MSU account.
    </li>
    <li>
      <AuthLink provider="github">Login</AuthLink>
      with your GitHub account.
    </li>
    <li>
      <router-link to="/lessons">
        Lessons
      </router-link>
    </li>
  </ul>
</template>

<script>
import AuthLink from './auth-link'

export default {
  components: {
    AuthLink
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

ul
  margin: 0 0 $design.layout.gutterWidth
  padding: $design.layout.gutterWidth
  background: $design.branding.lightgrey
  list-style-type: none
</style>
