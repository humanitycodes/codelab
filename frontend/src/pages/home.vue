<template>
  <Layout>
    <h1>Welcome Home</h1>
    <p>{{ token }}</p>
  </Layout>
</template>

<script>
import firebase from 'firebase'
import Layout from '@layouts/main'

export default {
  computed: {
    token: function () {
      return firebase.auth().currentUser
    }
  },
  components: {
    Layout
  }
}
</script>
