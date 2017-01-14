<template>
  <div>
    <h4>When you're done</h4>

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

    <p>
      And
      <span v-if="updating">
        update the
      </span>
      <span v-else>
        publish a
      </span>
      hosted version of your site:
    </p>

    <CodeBlock v-if="project.hosting === 'Surge'" lang="sh">
      # 1) Navigate to your project directory (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 2) Push the files in your project directory to Surge
      surge --project . --domain {{ projectHostedUrl }}
    </CodeBlock>
    <CodeBlock v-else-if="updating && project.hosting === 'Heroku'" lang="sh">
      # 1) Navigate to your project directory (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 3) Push your committed code to Heroku
      git push heroku master
    </CodeBlock>
    <CodeBlock v-else-if="project.hosting === 'Heroku'" lang="sh">
      # 1) Navigate to your project directory (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 2) Create the app on Heroku (if you haven't already)
      heroku create {{ projectName.toLowerCase() }}

      # 3) Push your committed code to Heroku
      git push heroku master
    </CodeBlock>
    <CodeBlock v-else lang="sh">
      # Push your committed code to GitHub Pages
      git push origin master:gh-pages
    </CodeBlock>

    <h4>Double check your work</h4>
    <p>
      Visit the pages for your
      <a
        :href="projectRepoUrl"
        class="button inline primary"
        target="_blank"
      >GitHub repo</a>
      and
      <a
        :href="projectHostedUrl"
        class="button inline primary"
        target="_blank"
      >hosted site</a>
      to confirm they include your latest changes.
    </p>
  </div>
</template>

<script>
export default {
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
    },
    updating: {
      type: Boolean,
      default: false
    }
  }
}
</script>
