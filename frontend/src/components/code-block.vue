<template>
  <pre><code><slot/></code></pre>
</template>

<script>
export default {
  beforeMount () {
    Object.values(this.$slots).forEach(slots => {
      slots.forEach(slot => {
        slot.text = slot.text.trim()
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

pre
  padding: 1rem
  margin: 0
  background-color: $design.branding.muted.light.gray
  > code
    display: block
</style>
