<template>
  <Layout>
    <h1>
      Welcome Home
      <span v-if="userSignedIn">{{ currentUser.fullName }}</span>
    </h1>
  </Layout>
</template>

<script>
import { userGetters } from '@state/helpers'
import Layout from '@layouts/main'

export default {
  components: {
    Layout
  },
  computed: userGetters
}
</script>
