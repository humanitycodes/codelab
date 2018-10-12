<template>
  <transition name="page-transition" appear>
    <div :key="$route.fullPath">
      <router-view/>
    </div>
  </transition>
</template>

<script>
import '@assets/css/app.scss'

export default {}
</script>
