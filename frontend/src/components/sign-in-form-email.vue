<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Email</label>
      <input v-model="credentials.email" placeholder="you@domain.com" type="text">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    credentials: {
      type: Object,
      required: true
    }
  }
}
</script>
