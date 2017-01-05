<template>
  <div>
    <MainNav/>
    <div id="container" :class="'page-layout-' + $route.meta.layout">
      <slot/>
    </div>
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
@import '../meta'

#container
  max-width: 800px
  margin: 0 auto
  padding: 0 $design.layout.gutterWidth
  &.page-layout-wide
    max-width: 940px
  &.page-layout-full
    max-width: none
</style>
