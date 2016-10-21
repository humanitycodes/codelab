<template>
  <Layout>
    <h1>Welcome Home {{ displayName }}</h1>
  </Layout>
</template>

<script>
import firebase from 'firebase'
import Layout from '@layouts/main'

export default {
  beforeCreate () {
    const vm = this
    firebase.auth().onAuthStateChanged(function (user) {
      vm.displayName = user ? user.displayName : ''
    })
  },
  data () {
    return {
      displayName: ''
    }
  },
  components: {
    Layout
  }
}
</script>
