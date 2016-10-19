<template>
  <div id="container">
    <ul id="nav">
      <li><AuthLink provider="msu">Sign up</AuthLink with your MSU account</li>
      <li><AuthLink provider="github">Login</AuthLink> with your GitHub account</li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import AuthLink from '@components/auth-link'

export default {
  components: {
    AuthLink
  }
}
</script>
