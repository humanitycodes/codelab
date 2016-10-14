<template>
  <a :href="url">Login</a>
</template>

<script>
import env from '@env'

export default {
  data () {
    return {
      url: 'https://oauth.ais.msu.edu/oauth/authorize?response_type=code&client_id=' + env.msuAuthClientId
    }
  }
}
</script>

<style scoped>
a {
  color: green;
}
</style>
