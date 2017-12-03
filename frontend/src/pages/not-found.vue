<template>
  <Layout>
    <div class="error-message">
      <h1>Page not found (404) ☹️</h1> 
      <p>Oops, we can't find anything at <strong>{{ $route.path }}</strong>.</p> 
      <p>
        <a href="javascript:history.go(-1)">Go back</a>
        | <a href="mailto:humanitycodes@gmail.com">Report a problem</a>
      <p>
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'

export default {
  components: {
    Layout
  }
}

</script>

<style lang="stylus" scoped>
.error-message
  max-width: 800px
  margin: 10% auto
  text-align: center
</style>
