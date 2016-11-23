<template>
  <button class="primary block" @click="signIn">
    Sign in
  </button>
</template>

<script>
export default {
  props: {
    credentials: {
      type: Object,
      required: true
    }
  },
  methods: {
    signIn () {
      console.log(this.credentials)
    }
  }
}
</script>
