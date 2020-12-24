
<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="user-email">Email</label>
      <input
        :value="email"
        id="user-email"
        name="user-email"
        title="Email address cannot be changed"
        readonly
        aria-readonly="true"
        disabled
        aria-disabled="true"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    email: String
  }
}
</script>
