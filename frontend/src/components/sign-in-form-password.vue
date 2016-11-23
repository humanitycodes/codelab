<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Password</label>
      <input v-model="credentials.password" type="password">
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
