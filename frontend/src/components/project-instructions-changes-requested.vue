<template>
  <div>
    <a
      :href="projectRepoUrl"
      target="_blank"
      class="button warning block"
    >
      Your GitHub Repository
    </a>
    <p>Feedback has been provided by an instructor. Please see any issues open on your GitHub repository above, respond to the comments, then update your project accordingly.</p>
    <p>When you are done, make sure to <strong>leave a comment for your instructor</strong> to let them know that you've updated the project.</p>
  </div>
</template>

<script>
export default {
  props: {
    projectRepoUrl: {
      type: String,
      required: true
    }
  }
}
</script>
