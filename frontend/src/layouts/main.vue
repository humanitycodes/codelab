<template>
  <div id="container">
    <MainNav/>
    <slot/>
  </div>
</template>

<script>
import MainNav from '@components/main-nav'

export default {
  components: {
    MainNav
  }
}
</script>

<style lang="stylus" scoped>
#container
  max-width: 600px
  margin: 0 auto
</style>
