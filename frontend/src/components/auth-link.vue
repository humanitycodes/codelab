<template>
  <a :href="url"><slot/></a>
</template>

<script>
import env from '@env'
import store from '@state/store'

export default {
  props: {
    provider: {
      type: String,
      required: true,
      validator: function (value) {
        return ['msu', 'github'].indexOf(value) >= 0
      }
    }
  },
  computed: {
    url: function () {
      switch (this.provider) {
        case 'github':
          const currentUser = store.state.users.currentUser
          const firebaseJwt = currentUser ? encodeURIComponent(currentUser.firebaseJwt) : ''
          return `https://github.com/login/oauth/authorize?scope=user&client_id=${env.githubAuthClientId}&state=${firebaseJwt}`
        case 'msu':
          return `https://oauth.ais.msu.edu/oauth/authorize?response_type=code&client_id=${env.msuAuthClientId}`
        default:
          return null
      }
    }
  }
}
</script>
