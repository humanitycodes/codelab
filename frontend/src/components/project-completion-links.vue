<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <a
        :href="repoUrl"
        target="_blank"
        class="button block"
      >
        GitHub Repository
      </a>
      <a
        v-if="hostedUrl"
        :href="hostedUrl"
        target="_blank"
        class="button block"
      >
        Live Result
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    repoUrl: {
      type: String,
      required: true
    },
    hostedUrl: String
  }
}
</script>
