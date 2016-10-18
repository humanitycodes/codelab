<template>
  <div id="container">
    <ul id="nav">
      <li><MsuAuthLink label="Sign up"/> with your MSU account</li>
      <li><GitHubAuthLink/> with your GitHub account</li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import MsuAuthLink from '@components/msu-auth-link'
import GitHubAuthLink from '@components/github-auth-link'

export default {
  components: {
    MsuAuthLink, GitHubAuthLink
  }
}
</script>
