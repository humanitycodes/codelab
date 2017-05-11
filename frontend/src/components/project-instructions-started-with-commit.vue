<template>
  <div>
    <ProjectCompletionLinks :repo-url="projectRepoUrl"/>

    <p v-if="error" class="error">{{ error }}</p>

    <ProjectCompletionUpdateInstructions
      :project="project"
      :projectName="projectName"
      :projectRepoUrl="projectRepoUrl"
      :projectHostedUrl="projectHostedUrl"
      :projectHostedSubdomain="projectHostedSubdomain"
    />

    <template v-if="instructors.length > 1">
      <h4>Choose a reviewer</h4>
      <select
        v-model="chosenInstructor"
        aria-label="Choose a reviewer"
      >
        <option
          v-for="instructor in instructors"
          :value="instructor.github.login"
        >{{ instructor.fullName }}</option>
      </select>
    </template>

    <h4>Submit for review</h4>
    <p>Final step! But first, make sure you've met the following criteria (check each box to confirm):</p>
    <label v-for="criterion in project.criteria" class="with-inline-input">
      <input type="checkbox" v-model="metCriteria[criterion['.key']]">
      <span v-html="convertRichContentToInlineHtml(criterion.content)"/>
    </label>

    <button
      class="primary block"
      @click="submitForReview"
      :disabled="!allCriteriaMet"
    >
      Submit project for review
    </button>
  </div>
</template>

<script>
import Axios from 'axios'
import QueryString from 'querystring'
import { userGetters } from '@state/helpers'
import ProjectCompletionUpdateInstructions from './project-completion-update-instructions'
import ProjectCompletionLinks from './project-completion-links'
import convertRichContentToInlineHtml from '@helpers/utils/convert-rich-content-to-inline-html'

export default {
  components: {
    ProjectCompletionLinks, ProjectCompletionUpdateInstructions
  },
  props: {
    course: {
      type: Object,
      required: true
    },
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
    },
    projectHostedSubdomain: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      metCriteria: this.project.criteria
        .map(criterion => ({ [criterion['.key']]: false }))
        .reduce((a, b) => Object.assign({}, a, b)),
      error: '',
      instructors: [],
      chosenInstructor: null
    }
  },
  created () {
    this.fetchInstructors()
  },
  computed: {
    ...userGetters,
    allCriteriaMet () {
      return this.chosenInstructor &&
        Object.keys(this.metCriteria).every(key => {
          return this.metCriteria[key]
        })
    }
  },
  methods: {
    convertRichContentToInlineHtml,
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
          body: `## ${this.project.title}\n\n@${this.chosenInstructor} Can you take a look at this? It's [hosted here](${this.projectHostedUrl}) and meets the following criteria:\n\n- [x] ${criteria.join('\n- [x] ')}\n\n<!-- ADD YOUR OWN NOTES, IF ANY, BELOW THIS LINE -->`
        })
      ].join('')

      this.projectCompletion.hostedUrl = this.projectHostedUrl
      window.open(newIssueUrl, '_blank').focus()
    },
    fetchInstructors () {
      Axios.get(`/api/courses/${this.course['.key']}/instructors`)
      .then(response => {
        this.error = ''
        this.instructors = []
        Object.keys(response.data).forEach(uid => {
          const instructor = {
            ...response.data[uid],
            uid
          }
          if (instructor.github) {
            this.instructors.push(instructor)
          }
        })
        if (this.instructors.length) {
          if (this.instructors.length > 1) {
            this.instructors = this.instructors.filter(instructor => {
              return instructor.uid !== this.currentUser.uid
            })
          }
          const random = Math.floor(Math.random() * this.instructors.length)
          this.chosenInstructor = this.instructors[random].github.login
        } else {
          this.chosenInstructor = null
          this.error = `Your instructor has not connected their GitHub account. Please tell your instructor about this so you can submit your project.`
        }
      })
      .catch(error => {
        console.error(error)
        this.error = `There was a problem getting the instructors for the course. If refreshing the page doesn't work, please tell your instructor about this and we'll work to resolve it as soon as possible.`
      })
    }
  }
}
</script>
