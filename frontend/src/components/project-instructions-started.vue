<template>
  <div>
    <ProjectCompletionLinks :repo-url="projectRepoUrl"/>

    <h4>Before you start coding</h4>

    <p>Clone the GitHub repository to your computer so you have a place to work:</p>
    <CodeBlock lang="sh">
      # 1) Navigate to the folder where you keep your projects
      cd PATH/TO/YOUR/PROJECTS

      # 2) Clone the project repo from GitHub
      git clone {{ projectRepoUrl }}.git

      # 3) Change into your project directory and begin working
      cd {{ projectName }}

      # 4) Create your "main" branch for making changes
      git checkout -b main
    </CodeBlock>

    <h4>As you code the project</h4>

    <p>Whenever you complete a feature:</p>
    <CodeBlock lang="sh">
      # 1) Navigate to your project folder (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 2) Add all the files you worked on to the list of changes you want to commit
      git add -A .

      # 3) Commit your changes with a message
      git commit -m "a short message describing your changes"

      # 4) Upload your commits to your GitHub repository
      git push origin main
    </CodeBlock>
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
    projectName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.repo-link
  width: 100%
  text-align: center
</style>
