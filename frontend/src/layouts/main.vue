<template>
  <div id="container">
    <ul id="nav">
      <li><MsuAuthLink label="Sign up"/> with your MSU Account</li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import MsuAuthLink from '@components/msu-auth-link'

export default {
  components: {
    MsuAuthLink
  }
}
</script>
