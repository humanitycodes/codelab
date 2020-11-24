<template>
  <Layout>
    <div class="github-standalone-signin-container">
      <h1>
        This app is restricted to
        {{ brand === 'codelab517' ? 'Code Lab 517' : 'MSU' }}
        instructors and students
      </h1>
      <AuthLink
        provider="github"
        class="
          github-standalone-signin-button
          button
          primary
          block
          extra-large
        "
      >
        <img src="../assets/images/logo-white.png" alt="Site logo">
        Sign in with GitHub
      </AuthLink>
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/bare'
import AuthLink from '@components/auth-link'
import brand from '@env/brand'

export default {
  components: {
    Layout, AuthLink
  },
  data () {
    return {
      brand
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.github-standalone-signin-container
  max-width: 640px
  margin: 50px auto 0
  text-align: center
  padding: 0 $design.layout.gutterWidth
.github-standalone-signin-button
  margin-top: 50px
  display: flex
  align-items: center
  justify-content: center
  img
    width: 1.7em
    height: 1.7em
    margin-right: $design.layout.gutterWidth
</style>
