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
