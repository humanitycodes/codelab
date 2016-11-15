<template>
  <Layout>
    <h1>Component Demos</h1>
    <hr>
    <h2>TerminalNavigator</h2>
    <TerminalNavigator/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import TerminalNavigator from '@components/terminal-navigator'

export default {
  components: {
    Layout, TerminalNavigator
  }
}
</script>

<style lang="stylus" scoped>
h1
  text-align: center
</style>
