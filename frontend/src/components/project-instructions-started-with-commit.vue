<template>
  <div>
    <h4>When you're done</h4>

    <p>Make sure that your latest work is on GitHub:</p>
    <CodeBlock lang="sh">
      # 1) Navigate to your project folder (unless you're already there)
      cd PATH/TO/{{ projectName }}

      # 2) Add all the files you worked on to the list of changes you want to commit
      git add -A .

      # 3) Commit your changes with a message
      git commit -m "a short message describing your changes"

      # 4) Upload your commits to your GitHub repository
      git push origin master
    </CodeBlock>

    <p>And publish a hosted version of your site:</p>
    <CodeBlock v-if="project.hosting === 'Heroku'">
      git push heroku master
    </CodeBlock>
    <CodeBlock v-else>
      git push origin master:gh-pages
    </CodeBlock>

    <h4>Double check your work</h4>
    <p>
      Visit the pages for your
      <a :href="projectRepoUrl" target="_blank">GitHub repo</a>
      and
      <a :href="projectHostedUrl" target="_blank">hosted site</a>
      to confirm they include your latest changes.
    </p>

    <template v-if="instructors.length > 1">
      <h4>Choose a reviewer</h4>
      <select v-model="chosenInstructor">
        <option
          v-for="instructor in instructors"
          :value="instructor.githubName"
        >{{ instructor.name }}</option>
      </select>
    </template>

    <h4>Submit for review</h4>
    <p>Final step! But first, please make sure you've met the following criteria (please check each box to confirm):</p>
    <label v-for="criterion in project.criteria">
      <input type="checkbox" v-model="metCriteria[criterion['.key']]">
      {{ criterion.content }}
    </label>

    <button
      class="primary block"
      @click="submitForReview"
      :disabled="!allCriteriaMet"
    >
      Submit
    </button>
  </div>
</template>

<script>
import QueryString from 'querystring'
import { userGetters } from '@state/helpers'

export default {
  props: {
    projectCompletion: {
      type: Object,
      required: true
    },
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
  },
  data () {
    const instructors = [
      {
        githubName: 'stuartpearman',
        name: 'Stuart Pearman'
      },
      {
        githubName: 'chrisvfritz',
        name: 'Chris Fritz'
      },
      {
        githubName: 'egillespie',
        name: 'Erik Gillespie'
      }
    ]

    return {
      metCriteria: this.project.criteria
        .map(criterion => ({ [criterion['.key']]: false }))
        .reduce((a, b) => Object.assign({}, a, b)),
      // TODO: Pull this in from the backend instead
      instructors,
      chosenInstructor: instructors[0].githubName
    }
  },
  computed: {
    ...userGetters,
    allCriteriaMet () {
      return Object.keys(this.metCriteria).every(key => {
        return this.metCriteria[key]
      })
    }
  },
  methods: {
    submitForReview () {
      const criteria = this.project.criteria.map(criterion => criterion.content)

      const newIssueUrl = [
        'https://github.com/',
        this.currentUser.profile.github.login,
        '/',
        this.projectName,
        '/issues/new?',
        QueryString.stringify({
          title: 'Project Feedback',
          body: `@${this.chosenInstructor} Can you take a look at this? It's [hosted here](${this.projectRepoUrl}) and meets the following criteria:\n\n- [x] ${criteria.join('\n- [x] ')}\n\n<!-- ADD YOUR OWN NOTES, IF ANY, BELOW THIS LINE -->`
        })
      ].join('')

      window.open(newIssueUrl, '_blank').focus()
    }
  }
}
</script>
