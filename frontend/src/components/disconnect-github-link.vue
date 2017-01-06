<template>
  <button
    @click="disconnectGithub(currentUser)"
    class="inline danger delete"
  >
    <slot/>
  </button>
</template>

<script>
import store from '@state/store'
import { userGetters } from '@state/helpers'

export default {
  methods: {
    disconnectGithub (user) {
      user.profile.github = null
      store.dispatch('updateCurrentUser')
    }
  },
  computed: userGetters
}
</script>
