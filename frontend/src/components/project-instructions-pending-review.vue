<template>
  <div>
    <ProjectCompletionLinks
      :repo-url="projectRepoUrl"
      :hosted-url="projectHostedUrl"
    />
    <p>
      An instructor will review your project as soon as possible. You may
      continue to improve it, or move on to another lesson. If this lesson is a
      prerequisite for a lesson you would like to start, contact an instructor
      to speed up the review.
    </p>

    <h4>If you make changes</h4>

    <p>Make sure that your latest work is on GitHub:</p>
    <CodeBlock lang="sh">
      # 1) Navigate to your project directory (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 2) Add all the files you worked on to the list of changes you want to commit
      git add -A .

      # 3) Commit your changes with a message
      git commit -m "a short message describing your changes"

      # 4) Upload all commits to your GitHub repository
      git push origin master
    </CodeBlock>

    <p>Update the live result with your changes:</p>
    <CodeBlock v-if="lesson.projectHosting === 'Surge'" lang="sh">
      # 1) Navigate to your project directory (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 2) Push the files in your project directory to Surge
      surge --project . --domain {{ projectHostedUrl }}
    </CodeBlock>
    <CodeBlock v-else-if="lesson.projectHosting === 'Heroku'" lang="sh">
      # 1) Navigate to your project directory (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 3) Push your committed code to Heroku
      git push heroku master
    </CodeBlock>
    <CodeBlock v-else lang="sh">
      # Push your committed code to GitHub Pages
      git push origin master:gh-pages
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
    lesson: {
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
