<template>
  <a :href="url"><slot/></a>
</template>

<script>
import serverBaseUrl from '@env/server-base-url'
import githubAuthClientId from '@env/github-auth-client-id'
import msuAuthClientId from '@env/msu-auth-client-id'
import requiredGitHubScopes from '@constants/github-scopes'
import { userGetters } from '@state/helpers'

const githubScopesPath = encodeURIComponent(requiredGitHubScopes.join(' '))

export default {
  props: {
    provider: {
      type: String,
      required: true,
      validator: function (value) {
        return ['github', 'msu'].includes(value)
      }
    }
  },
  computed: {
    ...userGetters,
    url: function () {
      switch (this.provider) {
        case 'github': {
          let url = [
            'https://github.com/login/oauth/authorize',
            `?scope=${githubScopesPath}`,
            `&client_id=${githubAuthClientId}`,
            `&redirect_uri=${serverBaseUrl}/auth/github/callback`
          ].join('')
          if (this.jsonWebToken) {
            url += `&state=${encodeURIComponent(this.jsonWebToken)}`
          }
          return url
        }
        case 'msu': {
          return [
            'https://oauth.itservices.msu.edu/oauth/authorize',
            '?response_type=code',
            `&client_id=${msuAuthClientId}`
          ].join('')
        }
        default: {
          return null
        }
      }
    }
  }
}
</script>
