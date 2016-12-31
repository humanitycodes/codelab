<template>
  <div>
    <ProjectCompletionLinks
      :repo-url="projectRepoUrl"
      :hosted-url="projectHostedUrl"
    />
    <p>An instructor will review your project as soon as possible. You may still continue to improve it while you wait, or move on to another lesson. However, it's not recommended to start a new lesson for which this one is a prerequisite until it's approved.</p>
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
