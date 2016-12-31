<template>
  <Layout>
    <h1>Sign in with Email</h1>
    <SignInForm/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import SignInForm from '@components/sign-in-form'

export default {
  components: {
    Layout, SignInForm
  }
}
</script>
