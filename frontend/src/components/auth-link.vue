<template>
  <a :href="url"><slot/></a>
</template>

<script>
import env from '@env'
import requiredGitHubScopes from '@constants/github-scopes'
import { userGetters } from '@state/helpers'

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
    ...userGetters,
    url: function () {
      switch (this.provider) {
        case 'github':
          let url = [
            'https://github.com/login/oauth/authorize',
            `?scope=${githubScopesPath}`,
            `&client_id=${env.githubAuthClientId}`,
            `&redirect_uri=${env.githubAuthRedirectURL}${this.$route.fullPath}`
          ].join('')
          if (this.jsonWebToken) {
            url += `&state=${encodeURIComponent(this.jsonWebToken)}`
          }
          return url
        case 'msu':
          return [
            'https://oauth.itservices.msu.edu/oauth/authorize',
            '?response_type=code',
            `&client_id=${env.msuAuthClientId}`
          ].join('')
        default:
          return null
      }
    }
  }
}
</script>
