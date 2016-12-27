<template>
  <pre><code><slot/></code></pre>
</template>

<script>
function trimSlots (vmSlots) {
  Object.values(vmSlots).forEach(slots => {
    slots.forEach(slot => {
      slot.text = slot.text.trim()
    })
  })
}

export default {
  beforeMount () {
    trimSlots(this.$slots)
  },
  beforeUpdate () {
    trimSlots(this.$slots)
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
