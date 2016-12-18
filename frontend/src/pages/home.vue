<template>
  <Layout>
    <h1>
      Welcome Home
      <span v-if="isUserSignedIn">{{ currentUser.profile.fullName }}</span>
    </h1>
    <div v-if="isUserSignedIn && currentUser.profile.github">
      <div>
        <strong>GitHub User:</strong>
        {{ currentUser.profile.github.login }}
        <DisconnectGithubLink>X</DisconnectGithubLink>
      </div>
      <div>
        <strong>GitHub Scopes:</strong>
        {{ currentUser.profile.github.scope }}
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
