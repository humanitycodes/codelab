<template>
  <a :href="url">{{ label }}</a>
</template>

<script>
import env from '@env'

export default {
  props: {
    label: {
      type: String,
      default: 'Login'
    }
  },
  data () {
    return {
      url: 'https://github.com/login/oauth/authorize?client_id=' + env.githubAuthClientId
    }
  }
}
</script>
