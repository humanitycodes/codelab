<template>
  <Layout>
    <h1>
      Welcome Home
      <span v-if="userSignedIn">{{ currentUser.fullName }}</span>
    </h1>
    <div v-if="userSignedIn && currentUser.github">
      <strong>GitHub User:</strong>
      {{ currentUser.github.login }}
      <DisconnectGithubLink>X</DisconnectGithubLink>
    </div>
  </Layout>
</template>

<script>
import { userGetters } from '@state/helpers'
import Layout from '@layouts/main'
import DisconnectGithubLink from '@components/disconnect-github-link'

export default {
  components: {
    Layout, DisconnectGithubLink
  },
  computed: userGetters
}
</script>
