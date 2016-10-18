<template>
  <a :href="url">{{ label }}</a>
</template>

<script>
import env from '@env'

export default {
  props: {
    label: {
      type: String,
      default: 'Login',
      required: true
    }
  },
  data () {
    return {
      url: 'https://oauth.ais.msu.edu/oauth/authorize?response_type=code&client_id=' + env.msuAuthClientId
    }
  }
}
</script>
