
<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="user-github-login">GitHub Username</label>
      <input
        :value="githubLogin"
        id="user-github-login"
        name="user-github-login"
        title="GitHub username cannot be changed"
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
    githubLogin: String
  }
}
</script>
