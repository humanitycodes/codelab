<template>
  <div>
    Woohoo! You're done. 😄
    <ProjectCompletionLinks
      :repo-url="projectRepoUrl"
      :hosted-url="projectHostedUrl"
    />
  </div>
</template>

<script>
import ProjectCompletionLinks from './project-completion-links'

export default {
  components: {
    ProjectCompletionLinks
  },
  props: {
    projectRepoUrl: {
      type: String,
      required: true
    },
    projectHostedUrl: {
      type: String,
      required: true
    }
  }
}
</script>
