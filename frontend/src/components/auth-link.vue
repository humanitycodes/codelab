<template>
  <a :href="url">{{ label }}</a>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Login'
    }
  },
  data () {
    return {
      url: ''
    }
  }
}
</script>
