<template>
  <button class="primary block" @click="getOuttaHere">
    My work here is done
  </button>
</template>

<script>
export default {
  props: {
    fallbackRoute: {
      type: String,
      default: '/'
    }
  },
  methods: {
    getOuttaHere () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push(this.fallbackRoute)
    }
  }
}
</script>
