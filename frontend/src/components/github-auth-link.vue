<template>
  <AuthLink :url="url"><slot/></AuthLInk>
</template>

<script>
import env from '@env'
import AuthLink from '@components/auth-link'

export default {
  data () {
    return {
      url: 'https://github.com/login/oauth/authorize?client_id=' + env.githubAuthClientId
    }
  },
  components: {
    AuthLink
  }
}
</script>
