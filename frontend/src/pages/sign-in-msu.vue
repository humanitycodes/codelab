<template>
  <div class="msu-standalone-signin-container">
    <h1>This app is restricted to MSU instructors and students</h1>
    <AuthLink
      provider="msu"
      class="
        btn-blue
        msu-standalone-signin-button
        button
        primary
        block
        extra-large
      "
    >
      <img src="../assets/images/logo-white.png" alt="Site logo">
      Sign in
    </AuthLink>
  </div>
</template>

<script>
import Layout from '@layouts/main'
import AuthLink from '@components/auth-link'

export default {
  components: {
    Layout, AuthLink
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.msu-standalone-signin-container
  max-width: 480px
  margin: 50px auto 0
  text-align: center
  padding: 0 $design.layout.gutterWidth
.msu-standalone-signin-button
  margin-top: 50px
  display: flex
  align-items: center
  justify-content: center
  img
    width: 1.7em
    height: 1.7em
    margin-right: $design.layout.gutterWidth
</style>
