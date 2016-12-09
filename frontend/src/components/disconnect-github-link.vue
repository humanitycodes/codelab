<template>
  <button @click="disconnectGithub(currentUser)" class="inline danger">
    <slot/>
  </button>
</template>

<script>
import { userGetters } from '@state/helpers'

export default {
  methods: {
    disconnectGithub (user) {
      user.github = null
    }
  },
  computed: userGetters
}
</script>
