<template>
  <div id="container">
    <ul id="nav">
      <li><LoginLink/></li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import LoginLink from '@components/login-link'

export default {
  components: {
    LoginLink
  }
}
</script>
