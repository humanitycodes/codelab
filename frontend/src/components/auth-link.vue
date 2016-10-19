<template>
  <a :href="url"><slot/></a>
</template>

<script>
import env from '@env'

const providers = {
  github: {
    url: 'https://github.com/login/oauth/authorize?scope=user:email&client_id=' + env.githubAuthClientId
  },
  msu: {
    url: 'https://oauth.ais.msu.edu/oauth/authorize?response_type=code&client_id=' + env.msuAuthClientId
  }
}

export default {
  props: {
    provider: {
      type: String,
      required: true,
      validator: function (value) {
        return value in providers
      }
    }
  },
  computed: {
    url: function () {
      return providers[this.provider].url
    }
  }
}
</script>
