<template>
  <div>
    <ProjectCompletionLinks
      :repo-url="projectRepoUrl"
      :hosted-url="projectHostedUrl"
    />

    <p>Feedback has been provided by an instructor. Please see any issues open on your GitHub repository above, respond to the comments (if necessary), then update your project accordingly:</p>

    <ProjectCompletionUpdateInstructions
      :project="project"
      :projectName="projectName"
      :projectRepoUrl="projectRepoUrl"
      :projectHostedUrl="projectHostedUrl"
      :updating="true"
    />

    <h4>Leave a comment</h4>
    <p>Finally, make sure to leave a comment on the issue to let your reviewer know that you've updated the project and it's ready for another look.</p>
  </div>
</template>

<script>
import ProjectCompletionLinks from './project-completion-links'
import ProjectCompletionUpdateInstructions from './project-completion-update-instructions'

export default {
  components: {
    ProjectCompletionLinks, ProjectCompletionUpdateInstructions
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
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
