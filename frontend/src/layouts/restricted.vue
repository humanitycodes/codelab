<template>
  <div>
    <UserNav/>
    <div id="container" :class="'page-layout-' + $route.meta.layout">
      <slot/>
    </div>
  </div>
</template>

<script>
import UserNav from '@components/user-nav'

export default {
  components: {
    UserNav
  }
}
</script>
