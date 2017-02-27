<template>
  <a :href="url"><slot/></a>
</template>

<script>
import env from '@env'
import store from '@state/store'
import requiredGitHubScopes from '@constants/github-scopes'

const githubScopesPath = encodeURIComponent(requiredGitHubScopes.join(' '))

export default {
  props: {
    provider: {
      type: String,
      required: true,
      validator: function (value) {
        return ['github', 'msu'].indexOf(value) >= 0
      }
    }
  },
  computed: {
    url: function () {
      switch (this.provider) {
        case 'github':
          const currentUser = store.state.users.currentUser
          const firebaseJwt = currentUser ? encodeURIComponent(currentUser.firebaseJwt) : ''
          return [
            'https://github.com/login/oauth/authorize',
            '?scope=', githubScopesPath,
            '&client_id=', env.githubAuthClientId,
            '&state=', firebaseJwt,
            '&redirect_uri=', env.githubAuthRedirectURL + this.$route.fullPath
          ].join('')
        case 'msu':
          return `https://oauth.ais.msu.edu/oauth/authorize?response_type=code&client_id=${env.msuAuthClientId}`
        default:
          return null
      }
    }
  }
}
</script>
