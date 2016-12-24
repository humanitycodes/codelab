<template>
  <pre><code>{{ this.$slots.default[0].text.trim() }}</code></pre>
</template>

<style lang="stylus" scoped>
@import '../meta'

pre
  padding: 1rem
  background-color: $design.branding.muted.light.gray
  > code
    display: block
    font-weight: bold
</style>
